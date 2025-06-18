import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // For browser-based dashboard
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { review_prebrief_id, comment, coaching_angle } = req.body;

  if (!review_prebrief_id || !comment) {
    return res.status(400).json({ error: 'Missing review_prebrief_id or comment' });
  }

  const { error } = await supabase
    .from('reviewer_notes')
    .insert([{ review_prebrief_id, comment, coaching_angle }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
