import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  let { review_prebrief_id } = req.query;
  if (Array.isArray(review_prebrief_id)) {
    review_prebrief_id = review_prebrief_id[0];
  }
  if (!review_prebrief_id) {
    return res.status(400).json({ error: 'Missing review_prebrief_id' });
  }
  const { data, error } = await supabase
    .from('reviewer_notes')
    .select('*')
    .eq('review_prebrief_id', review_prebrief_id)
    .order('created_at', { ascending: false });
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ notes: data });
} 