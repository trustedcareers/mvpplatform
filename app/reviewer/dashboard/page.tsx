import * as React from "react";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ReviewerDashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  // Fetch review summaries
  const { data: reviews, error: reviewsError } = await supabase
    .from('review_summary')
    .select('id, user_id, alignment_rating, created_at, status');

  // Fetch user_context
  const { data: userContexts, error: userContextError } = await supabase
    .from('user_context')
    .select('user_id, role_title, level, industry, situation, priorities');

  // Fetch reviewer notes and count per review_prebrief_id
  const { data: reviewerNotes, error: reviewerNotesError } = await supabase
    .from('reviewer_notes')
    .select('review_prebrief_id');

  // Count notes per review_prebrief_id
  const notesCountMap: Record<string, number> = {};
  if (Array.isArray(reviewerNotes)) {
    for (const note of reviewerNotes) {
      if (note.review_prebrief_id) {
        notesCountMap[note.review_prebrief_id] = (notesCountMap[note.review_prebrief_id] || 0) + 1;
      }
    }
  }

  // Merge reviews with user context (no admin user info)
  const merged = (reviews || []).map((review: any) => {
    const context = (userContexts || []).find((c: any) => c.user_id === review.user_id);
    // reviewer_notes_count from notesCountMap
    const reviewerNotesCount = notesCountMap[review.id] || 0;
    const reviewerStatus = reviewerNotesCount > 0 ? 'feedback provided' : 'pending feedback';
    return {
      ...review,
      role_title: context?.role_title || 'N/A',
      level: context?.level || 'N/A',
      industry: context?.industry || 'N/A',
      situation: context?.situation || 'N/A',
      priorities: context?.priorities || [],
      alignment_rating: review.alignment_rating || 'N/A',
      created_at: review.created_at || 'N/A',
      status: review.status || 'N/A',
      reviewer_notes_count: reviewerNotesCount,
      reviewer_status: reviewerStatus,
    };
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Reviewer Dashboard</h1>
      <p className="mb-4">This page will show assigned reviews.</p>
      <div className="mb-4">
        <Link href="/" className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 font-medium">Go to Candidate View</Link>
      </div>
      {(reviewsError || userContextError || reviewerNotesError) && (
        <div className="text-red-600 mb-2">
          <div>Error loading reviews or user context.</div>
          <pre className="whitespace-pre-wrap text-xs bg-red-100 p-2 border border-red-300 rounded">{JSON.stringify(reviewsError || userContextError || reviewerNotesError, null, 2)}</pre>
        </div>
      )}
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-2 py-1">User ID</th>
            <th className="border px-2 py-1">Role Title</th>
            <th className="border px-2 py-1">Level</th>
            <th className="border px-2 py-1">Industry</th>
            <th className="border px-2 py-1">Situation</th>
            <th className="border px-2 py-1">Priorities</th>
            <th className="border px-2 py-1">Alignment Rating</th>
            <th className="border px-2 py-1">Created At</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Reviewer Comments</th>
            <th className="border px-2 py-1">Reviewer Status</th>
            <th className="border px-2 py-1">Report</th>
          </tr>
        </thead>
        <tbody>
          {merged && merged.length > 0 ? (
            merged.map((review: any) => (
              <tr key={review.id}>
                <td className="border px-2 py-1">{review.user_id}</td>
                <td className="border px-2 py-1">{review.role_title}</td>
                <td className="border px-2 py-1">{review.level}</td>
                <td className="border px-2 py-1">{review.industry}</td>
                <td className="border px-2 py-1">{review.situation}</td>
                <td className="border px-2 py-1">{Array.isArray(review.priorities) ? review.priorities.join(', ') : 'N/A'}</td>
                <td className="border px-2 py-1">{review.alignment_rating}</td>
                <td className="border px-2 py-1">{review.created_at !== 'N/A' ? new Date(review.created_at).toLocaleDateString() : 'N/A'}</td>
                <td className="border px-2 py-1">{review.status}</td>
                <td className="border px-2 py-1 text-center">{review.reviewer_notes_count}</td>
                <td className="border px-2 py-1">{review.reviewer_status}</td>
                <td className="border px-2 py-1">
                  <Link href={`/reviewer/review/${review.id}`} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-medium">View</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-2 py-1" colSpan={12}>No reviews found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 