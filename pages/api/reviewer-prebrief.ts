import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { id, summary } = req.body;
  if (!id || typeof summary !== 'string') {
    return res.status(400).json({ error: 'Missing id or summary' });
  }
  const { error } = await supabase
    .from('review_prebrief')
    .update({ summary })
    .eq('id', id);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ success: true });
} 