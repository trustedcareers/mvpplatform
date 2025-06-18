import * as React from "react";
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function safeParseArray(val: any) {
  try {
    if (typeof val === 'string') {
      const once = JSON.parse(val);
      if (typeof once === 'string') {
        return JSON.parse(once);
      }
      return once;
    }
    return Array.isArray(val) ? val : [];
  } catch {
    return [];
  }
}

export default async function ReviewReportPage({ params }: { params: { summary_id: string } }) {
  const { data, error } = await supabase
    .from('review_summary')
    .select('*')
    .eq('id', params.summary_id)
    .single();

  if (error || !data) {
    return notFound();
  }

  const strengths = safeParseArray(data.strengths);
  const opportunities = safeParseArray(data.opportunities);
  const negotiation_priorities = safeParseArray(data.negotiation_priorities);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Review Report</h1>
      <div className="mb-2"><b>Status:</b> {data.status}</div>
      <div className="mb-2"><b>Alignment Rating:</b> {data.alignment_rating}</div>
      <div className="mb-2"><b>Alignment Explanation:</b> {data.alignment_explanation}</div>
      <div className="mb-2"><b>Confidence Score:</b> {data.confidence_score}</div>
      <div className="mb-2"><b>Recommendation:</b> {data.recommendation}</div>
      <div className="mb-2"><b>Negotiation Priorities:</b>
        <ol style={{ listStyleType: 'decimal', marginLeft: '1.5rem' }}>
          {Array.isArray(negotiation_priorities) && negotiation_priorities.map((n: string, i: number) => <li key={i}>{n}</li>)}
        </ol>
      </div>
      <div className="mb-2"><b>Strengths:</b>
        <ul className="list-disc ml-6">
          {Array.isArray(strengths) && strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
        </ul>
      </div>
      <div className="mb-2"><b>Opportunities:</b>
        <ul className="list-disc ml-6">
          {Array.isArray(opportunities) && opportunities.map((o: string, i: number) => <li key={i}>{o}</li>)}
        </ul>
      </div>
      <div className="mb-2 text-xs text-gray-500">
        <div>Created: {data.created_at}</div>
        <div>Updated: {data.updated_at}</div>
      </div>
    </div>
  );
} 