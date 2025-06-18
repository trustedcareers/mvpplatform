import { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated user
    const supabase = createPagesServerClient({ req, res });
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log('[API/upload] Authentication failed:', userError);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('[API/upload] Authenticated user:', user.id);

    const { fileName, fileType, notes, fileData } = req.body;

    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'Missing fileName or fileData' });
    }

    // Convert base64 back to buffer
    const fileBuffer = Buffer.from(fileData, 'base64');
    
    // Sanitize filename by removing/replacing invalid characters
    const sanitizedName = fileName
      .replace(/[[\]()]/g, '') // Remove brackets and parentheses
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace other special chars with underscore
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
    
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${sanitizedName}`;
    const filePath = `${user.id}/${uniqueFileName}`;

    console.log('[API/upload] Original filename:', fileName);
    console.log('[API/upload] Sanitized filename:', uniqueFileName);
    console.log('[API/upload] File path:', filePath);
    console.log('[API/upload] File size:', fileBuffer.length);

    // Create service role client for storage operations
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!serviceRoleKey) {
      console.error('[API/upload] No service role key found');
      return res.status(500).json({ error: 'Server configuration error: missing service role key' });
    }

    console.log('[API/upload] Using service role for storage operations');
    const storageClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // First, ensure the bucket exists
    console.log('[API/upload] Checking if contracts bucket exists...');
    const { data: buckets, error: bucketsError } = await storageClient.storage.listBuckets();
    
    console.log('[API/upload] Available buckets:', buckets?.map(b => b.name) || 'none');
    
    const contractsBucket = buckets?.find(b => b.name === 'contracts');
    
    if (!contractsBucket) {
      console.log('[API/upload] Creating contracts bucket...');
      const { data: newBucket, error: createError } = await storageClient.storage.createBucket('contracts', {
        public: true,
        allowedMimeTypes: ['application/pdf', 'image/*', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (createError) {
        console.error('[API/upload] Failed to create bucket:', createError);
        return res.status(500).json({ error: `Failed to create storage bucket: ${createError.message}` });
      }
      
      console.log('[API/upload] Bucket created successfully:', newBucket);
    }

    // Upload to storage
    const { data: uploadData, error: uploadError } = await storageClient.storage
      .from('contracts')
      .upload(filePath, fileBuffer, {
        contentType: fileType || 'application/octet-stream',
        upsert: true
      });

    if (uploadError) {
      console.error('[API/upload] Storage upload error:', uploadError);
      return res.status(500).json({ error: `Upload failed: ${uploadError.message}` });
    }

    console.log('[API/upload] File uploaded successfully:', uploadData);

    // Get public URL
    const { data: urlData } = storageClient.storage
      .from('contracts')
      .getPublicUrl(filePath);

    const fileUrl = urlData?.publicUrl || '';

    // Save metadata to database using authenticated client (not service role)
    console.log('[API/upload] Preparing database insert...');
    
    // Minimal insert without notes column for now
    const insertData = {
      file_url: fileUrl,
      user_id: user.id,
      file_type: fileType,
      filename: fileName, // Keep original filename for display
      uploaded_at: new Date().toISOString()
    };

    console.log('[API/upload] Inserting metadata:', insertData);

    const { data: insertResult, error: insertError } = await supabase
      .from('contract_documents')
      .insert([insertData])
      .select();

    if (insertError) {
      console.error('[API/upload] Database insert error:', insertError);
      return res.status(500).json({ error: `Database error: ${insertError.message}` });
    }

    console.log('[API/upload] Metadata saved successfully:', insertData);

    res.status(200).json({ 
      success: true, 
      fileUrl,
      metadata: insertResult?.[0] || insertData
    });

  } catch (error) {
    console.error('[API/upload] Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}; 