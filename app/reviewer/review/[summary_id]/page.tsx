import * as React from "react";
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import ReviewerCommentSectionWrapper from './ReviewerCommentSectionWrapper';
import EditablePrebrief from './EditablePrebrief';
import PDFButtonWrapper from './PDFButtonWrapper';

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
  const awaitedParams = await params;
  // Fetch review summary
  const { data: summary, error } = await supabase
    .from('review_summary')
    .select('*')
    .eq('id', awaitedParams.summary_id)
    .single();

  if (error || !summary) {
    return notFound();
  }

  // Fetch the most recent review_prebrief for the user
  const { data: prebriefArr, error: prebriefError } = await supabase
    .from('review_prebrief')
    .select('*')
    .eq('user_id', summary.user_id)
    .order('generated_at', { ascending: false })
    .limit(1);
  const prebrief = Array.isArray(prebriefArr) && prebriefArr.length > 0 ? prebriefArr[0] : null;

  // Fetch reviewer notes if we have a prebrief
  const { data: reviewerNotes, error: notesError } = prebrief ? await supabase
    .from('reviewer_notes')
    .select('*')
    .eq('review_prebrief_id', prebrief.id)
    .order('created_at', { ascending: true }) : { data: null, error: null };

  const strengths = safeParseArray(summary.strengths);
  const opportunities = safeParseArray(summary.opportunities);
  const negotiation_priorities = safeParseArray(summary.negotiation_priorities);

  // Fetch clause analysis for the user
  const { data: clausesData, error: clausesError } = await supabase
    .from('review_results')
    .select('*')
    .eq('user_id', summary.user_id)
    .order('created_at', { ascending: false });
  const clauses = Array.isArray(clausesData) ? clausesData : [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* PDF Download Button */}
      <PDFButtonWrapper
        summary={{
          alignment: summary.alignment_rating,
          recommendation: summary.recommendation,
          strengths: strengths,
          weaknesses: opportunities,
          negotiationPriorities: negotiation_priorities,
          dateGenerated: new Date().toLocaleDateString(),
        }}
        clauses={clauses.map((clause: any) => ({
          clause_type: clause.clause_type,
          status: clause.clause_status,
          rationale: clause.rationale,
          recommendation: clause.recommendation,
          excerpt: clause.contract_excerpt || '',
          source_document: clause.source_document,
          confidence: clause.confidence_score,
        }))}
        reviewerNotes={reviewerNotes?.map((note: any) => ({
          comment: note.comment,
          coaching_angle: note.coaching_angle,
          created_at: note.created_at,
        }))}
      />
      {/* Navigation */}
      <div>
        <a href="/reviewer/dashboard" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">Back to Dashboard</a>
      </div>
      {/* Header */}
      <h1 className="text-2xl font-bold">Review Report</h1>
      {/* Pre-Brief Section */}
      {prebrief && <EditablePrebrief prebrief={prebrief} />}
      {/* Review Details Section */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-2">
        <div><b>Status:</b> {summary.status}</div>
        <div><b>Alignment Rating:</b> {summary.alignment_rating}</div>
        <div><b>Alignment Explanation:</b> {summary.alignment_explanation}</div>
        <div><b>Confidence Score:</b> {summary.confidence_score}</div>
        <div><b>Recommendation:</b> {summary.recommendation}</div>
        <div><b>Negotiation Priorities:</b>
          <ol className="list-decimal ml-6">
            {Array.isArray(negotiation_priorities) && negotiation_priorities.map((n: string, i: number) => <li key={i}>{n}</li>)}
          </ol>
        </div>
        <div><b>Strengths:</b>
          <ul className="list-disc ml-6">
            {Array.isArray(strengths) && strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div><b>Opportunities:</b>
          <ul className="list-disc ml-6">
            {Array.isArray(opportunities) && opportunities.map((o: string, i: number) => <li key={i}>{o}</li>)}
          </ul>
        </div>
        <div className="text-xs text-gray-500">
          <div>Created: {summary.created_at}</div>
          <div>Updated: {summary.updated_at}</div>
        </div>
      </div>
      {/* Reviewer Comments Section (moved to bottom) */}
      {prebrief && (
        <div className="p-4 bg-white border border-gray-200 rounded">
          <h2 className="text-lg font-semibold mb-4">Reviewer Comments</h2>
          <ReviewerCommentSectionWrapper prebriefId={prebrief.id} />
        </div>
      )}
    </div>
  );
} 