'use client';

import { useUser } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PDFButtonWrapper from './PDFButtonWrapper';

interface ReviewSummary {
  id: string;
  strengths: string[];
  opportunities: string[];
  alignment_rating: string;
  alignment_explanation: string;
  confidence_score: number;
  recommendation: string;
  negotiation_priorities: string[];
  created_at: string;
  reviewer_notes?: any[];
}

interface ReviewClause {
  id: string;
  clause_type: string;
  clause_status: string;
  rationale: string;
  recommendation: string;
  source_document: string;
  confidence_score: number;
  contract_excerpt?: string;
}

export default function ReviewSummaryPage() {
  const user = useUser();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [clauses, setClauses] = useState<ReviewClause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadReviewData();
  }, [user]);

  const loadReviewData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load summary
      const { data: summaryData, error: summaryError } = await supabase
        .from('review_summary')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (summaryError && summaryError.code !== 'PGRST116') {
        throw summaryError;
      }

      // Load clauses
      const { data: clausesData, error: clausesError } = await supabase
        .from('review_results')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (clausesError) {
        throw clausesError;
      }

      const summary = Array.isArray(summaryData) && summaryData.length > 0 ? summaryData[0] : null;

      // Fetch reviewer notes if we have a summary
      const { data: reviewerNotes, error: notesError } = summary ? await supabase
        .from('reviewer_notes')
        .select('*')
        .eq('review_prebrief_id', summary.review_prebrief_id)
        .order('created_at', { ascending: true }) : { data: null, error: null };

      setSummary(summary);
      setClauses(clausesData || []);

    } catch (err: any) {
      console.error('Error loading review data:', err);
      setError(err.message || 'Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  const getAlignmentColor = (rating: string) => {
    switch (rating) {
      case 'aligned': return 'text-green-600 bg-green-50';
      case 'partially_aligned': return 'text-yellow-600 bg-yellow-50';
      case 'misaligned': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-700 bg-green-100';
      case 'good': return 'text-blue-700 bg-blue-100';
      case 'standard': return 'text-gray-700 bg-gray-100';
      case 'concerning': return 'text-orange-700 bg-orange-100';
      case 'red_flag': return 'text-red-700 bg-red-100';
      case 'missing': return 'text-purple-700 bg-purple-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your contract analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => router.push('/debug/analyze')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Analysis Page
          </button>
        </div>
      </div>
    );
  }

  if (!summary && clauses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No analysis found. Please run an analysis first.</p>
          <button
            onClick={() => router.push('/debug/analyze')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Run Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* PDF Download Button */}
        {summary && (
          <PDFButtonWrapper
            summary={{
              alignment: summary.alignment_rating,
              recommendation: summary.recommendation,
              strengths: summary.strengths || [],
              weaknesses: summary.opportunities || [],
              negotiationPriorities: summary.negotiation_priorities || [],
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
            reviewerNotes={summary ? summary.reviewer_notes?.map((note: any) => ({
              comment: note.comment,
              coaching_angle: note.coaching_angle,
              created_at: note.created_at,
            })) : undefined}
          />
        )}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contract Analysis Summary</h1>
          <p className="text-gray-600">Personalized analysis of your employment offer</p>
        </div>

        {summary && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Overall Assessment</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getAlignmentColor(summary.alignment_rating)}`}>
                  {summary.alignment_rating.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              <p className="text-gray-700 mb-4">{summary.alignment_explanation}</p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Recommendation</h3>
                <p className="text-blue-800">{summary.recommendation}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Key Strengths</h3>
                <ul className="space-y-2">
                  {summary.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {summary.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-500 mr-2">⚠</span>
                      <span className="text-gray-700">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Negotiation Priorities</h3>
              <ol className="space-y-2">
                {summary.negotiation_priorities.map((priority, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{priority}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {clauses.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Clause Analysis</h2>
            <div className="space-y-6">
              {clauses.map((clause) => (
                <div key={clause.id} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{clause.clause_type}</h3>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(clause.clause_status)}`}>
                      {clause.clause_status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{clause.rationale}</p>
                  <div className="bg-gray-50 p-3 rounded mb-2">
                    <p className="text-sm font-medium text-gray-900 mb-1">Recommendation:</p>
                    <p className="text-sm text-gray-700">{clause.recommendation}</p>
                  </div>
                  {clause.contract_excerpt && (
                    <div className="bg-blue-50 p-3 rounded mb-2">
                      <p className="text-sm font-medium text-blue-900 mb-1">Contract Excerpt:</p>
                      <p className="text-sm text-blue-800 italic">"{clause.contract_excerpt}"</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Source: {clause.source_document}</span>
                    <span>Confidence: {Math.round(clause.confidence_score * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.push('/debug/analyze')}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Run New Analysis
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 