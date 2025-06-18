import * as React from "react";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for review_summary and user_context (anon key)
const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Admin client for auth.users (service role key)
const adminSupabase = createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } });

export default async function ReviewerDashboardPage() {
  // Fetch review summaries
  const { data: reviews, error: reviewsError } = await supabase
    .from('review_summary')
    .select('id, user_id, alignment_rating');

  // Fetch user_context
  const { data: userContexts, error: userContextError } = await supabase
    .from('user_context')
    .select('user_id, role_title, level, industry, situation, priorities');

  // Fetch users from auth.users using Admin API
  let users: any[] = [];
  let usersError: any = null;
  try {
    const { data, error } = await adminSupabase.auth.admin.listUsers();
    if (error) {
      usersError = error;
    } else {
      users = data.users;
    }
  } catch (err) {
    usersError = err instanceof Error ? err.message : String(err);
  }

  // Merge reviews with user info and user context
  const merged = (reviews || []).map((review: any) => {
    const user = (users || []).find((u: any) => u.id === review.user_id);
    const context = (userContexts || []).find((c: any) => c.user_id === review.user_id);
    return {
      ...review,
      role_title: context?.role_title || 'N/A',
      level: context?.level || 'N/A',
      industry: context?.industry || 'N/A',
      situation: context?.situation || 'N/A',
      priorities: context?.priorities || [],
      alignment_rating: review.alignment_rating || 'N/A',
    };
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Reviewer Dashboard</h1>
      <p className="mb-4">This page will show assigned reviews.</p>
      {(reviewsError || usersError || userContextError) && (
        <div className="text-red-600 mb-2">
          <div>Error loading reviews, users, or user context.</div>
          <pre className="whitespace-pre-wrap text-xs bg-red-100 p-2 border border-red-300 rounded">{JSON.stringify(reviewsError || usersError || userContextError, null, 2)}</pre>
        </div>
      )}
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-2 py-1">Role Title</th>
            <th className="border px-2 py-1">Level</th>
            <th className="border px-2 py-1">Industry</th>
            <th className="border px-2 py-1">Situation</th>
            <th className="border px-2 py-1">Priorities</th>
            <th className="border px-2 py-1">Alignment Rating</th>
            <th className="border px-2 py-1">Report</th>
          </tr>
        </thead>
        <tbody>
          {merged && merged.length > 0 ? (
            merged.map((review: any) => (
              <tr key={review.id}>
                <td className="border px-2 py-1">{review.role_title}</td>
                <td className="border px-2 py-1">{review.level}</td>
                <td className="border px-2 py-1">{review.industry}</td>
                <td className="border px-2 py-1">{review.situation}</td>
                <td className="border px-2 py-1">{Array.isArray(review.priorities) ? review.priorities.join(', ') : 'N/A'}</td>
                <td className="border px-2 py-1">{review.alignment_rating}</td>
                <td className="border px-2 py-1">
                  <Link href={`/reviewer/review/${review.id}`} className="text-blue-600 underline">View Report</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-2 py-1" colSpan={7}>No reviews found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 