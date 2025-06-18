// pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { analyzeContract } from '@/lib/analyzeContract';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Create authenticated Supabase client
  const supabase = createPagesServerClient({ req, res });
  
  // Get the authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Use the authenticated user's ID instead of relying on request body
  const userId = user.id;
  console.log('[API/analyze] Authenticated user ID:', userId);

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    // Pass the authenticated supabase client to analyzeContract
    const analysisResult = await analyzeContract(userId, supabase);
    
    const clauseCount = analysisResult.clauses?.length || 0;
    const hasSummary = !!analysisResult.summary;
    
    return res.status(200).json({ 
      success: true, 
      clauses: analysisResult.clauses,
      summary: analysisResult.summary,
      message: `Analysis complete. Found ${clauseCount} clauses${hasSummary ? ' and personalized summary' : ''}.`
    });
  } catch (err: any) {
    console.error('[API/analyze] Full error object:', err);
    console.error('[API/analyze] Error message:', err.message);
    console.error('[API/analyze] Error stack:', err.stack);
    
    // Return more detailed error information
    return res.status(500).json({ 
      error: err.message || 'Unknown error occurred',
      details: err.toString(),
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}
