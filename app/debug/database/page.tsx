'use client';

import { useUser } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DatabaseDebugPage() {
  const user = useUser();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    checkDatabaseStatus();
  }, [user]);

  const checkDatabaseStatus = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Check review_summary table
      const { data: summaryData, error: summaryError } = await supabase
        .from('review_summary')
        .select('*')
        .limit(1);

      results.review_summary = {
        exists: !summaryError,
        error: summaryError?.message,
        sampleCount: summaryData?.length || 0
      };

      // Check review_results table
      const { data: resultsData, error: resultsError } = await supabase
        .from('review_results')
        .select('*')
        .limit(1);

      results.review_results = {
        exists: !resultsError,
        error: resultsError?.message,
        sampleCount: resultsData?.length || 0
      };

      // Check user_context table
      const { data: contextData, error: contextError } = await supabase
        .from('user_context')
        .select('*')
        .eq('user_id', user?.id)
        .limit(1);

      results.user_context = {
        exists: !contextError,
        error: contextError?.message,
        userHasData: contextData && contextData.length > 0
      };

      // Check contract_documents table
      const { data: docsData, error: docsError } = await supabase
        .from('contract_documents')
        .select('*')
        .eq('user_id', user?.id)
        .limit(1);

      results.contract_documents = {
        exists: !docsError,
        error: docsError?.message,
        userHasData: docsData && docsData.length > 0
      };

      // Check for contract_excerpt column with graceful fallback
      try {
        const { data: excerptTest, error: excerptError } = await supabase
          .from('review_results')
          .select('contract_excerpt')
          .limit(1);

        results.contract_excerpt_column = {
          exists: !excerptError,
          error: excerptError?.message
        };
      } catch (excerptCheckError: any) {
        // If the column doesn't exist, this will throw a schema cache error
        if (excerptCheckError.message && (
          excerptCheckError.message.includes('contract_excerpt') ||
          excerptCheckError.message.includes('schema cache')
        )) {
          results.contract_excerpt_column = {
            exists: false,
            error: 'Column does not exist'
          };
        } else {
          results.contract_excerpt_column = {
            exists: false,
            error: excerptCheckError.message
          };
        }
      }

    } catch (error: any) {
      results.general_error = error.message;
    }

    setStatus(results);
    setLoading(false);
  };

  const getStatusIcon = (exists: boolean, error?: string) => {
    if (error) return '❌';
    return exists ? '✅' : '⚠️';
  };

  const getStatusText = (exists: boolean, error?: string) => {
    if (error) return `Error: ${error}`;
    return exists ? 'OK' : 'Missing';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking database status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Status</h1>
          <p className="text-gray-600">Verify all required tables and columns exist</p>
        </div>

        <div className="grid gap-6">
          {/* Tables Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Database Tables</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">review_summary</span>
                  <p className="text-sm text-gray-600">Stores personalized analysis summaries</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl mr-2">
                    {getStatusIcon(status.review_summary?.exists, status.review_summary?.error)}
                  </span>
                  <span className="text-sm">
                    {getStatusText(status.review_summary?.exists, status.review_summary?.error)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">review_results</span>
                  <p className="text-sm text-gray-600">Stores detailed clause analysis</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl mr-2">
                    {getStatusIcon(status.review_results?.exists, status.review_results?.error)}
                  </span>
                  <span className="text-sm">
                    {getStatusText(status.review_results?.exists, status.review_results?.error)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">contract_excerpt column</span>
                  <p className="text-sm text-gray-600">New column for storing contract quotes</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl mr-2">
                    {getStatusIcon(status.contract_excerpt_column?.exists, status.contract_excerpt_column?.error)}
                  </span>
                  <span className="text-sm">
                    {getStatusText(status.contract_excerpt_column?.exists, status.contract_excerpt_column?.error)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">user_context</span>
                  <p className="text-sm text-gray-600">Your profile data</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl mr-2">
                    {getStatusIcon(status.user_context?.exists, status.user_context?.error)}
                  </span>
                  <span className="text-sm">
                    {status.user_context?.userHasData ? 'Has Data' : 'No Data'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">contract_documents</span>
                  <p className="text-sm text-gray-600">Your uploaded files</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl mr-2">
                    {getStatusIcon(status.contract_documents?.exists, status.contract_documents?.error)}
                  </span>
                  <span className="text-sm">
                    {status.contract_documents?.userHasData ? 'Has Data' : 'No Data'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          {(!status.review_summary?.exists || status.review_summary?.error) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Setup Required</h3>
              <p className="text-yellow-700 mb-4">
                The review_summary table needs to be created. Run this command to get the SQL:
              </p>
              <code className="bg-yellow-100 px-2 py-1 rounded text-sm">
                node setup-review-summary-table.js
              </code>
              <p className="text-yellow-700 mt-2 text-sm">
                Then copy the SQL output and run it in your Supabase SQL Editor.
              </p>
            </div>
          )}

          {/* Success Message */}
          {status.review_summary?.exists && status.review_results?.exists && status.contract_excerpt_column?.exists && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Database Ready!</h3>
              <p className="text-green-700 mb-4">
                All required tables and columns exist. You can now test the full analysis flow.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => router.push('/intake')}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Complete Profile
                </button>
                <button
                  onClick={() => router.push('/upload')}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Upload Contract
                </button>
                <button
                  onClick={() => router.push('/debug/analyze')}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Run Analysis
                </button>
              </div>
            </div>
          )}

          {/* Raw Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Status Data</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(status, null, 2)}
            </pre>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={checkDatabaseStatus}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 mr-4"
          >
            Refresh Status
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