'use client';

import { useEffect, useState } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

export default function AnalyzePage() {
  const [status, setStatus] = useState('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [hasRun, setHasRun] = useState(false);
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const resetAndRunAnalysis = () => {
    setHasRun(false);
    setLogs([]);
    setResult(null);
    setStatus('idle');
  };

  const addLog = (message: string) => {
    console.log('[Debug]', message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    // If no user, redirect to login
    if (user === null) {
      router.push('/login');
      return;
    }

    // If user is still loading, wait
    if (user === undefined) {
      setStatus('Loading user...');
      return;
    }

    // Prevent multiple runs
    if (hasRun) {
      return;
    }

    const runAnalysis = async () => {
      setHasRun(true);
      addLog('🔍 Starting analysis...');
      setStatus('Checking user context...');

      try {
        // First check if user context exists
        addLog('📋 Checking user context...');
        const { data: userContext } = await supabase
          .from('user_context')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!userContext) {
          addLog('➕ Creating test user context...');
          setStatus('Creating test user context...');
          const { error: insertError } = await supabase
            .from('user_context')
            .insert({
              user_id: user.id,
              role_title: 'Software Engineer',
              level: 'senior',
              industry: 'Technology',
              situation: 'exploring',
              target_comp_base: 150000,
              target_comp_total: 200000,
              priorities: ['comp', 'growth'],
              confidence_rating: 4
            });

          if (insertError) {
            addLog(`❌ Error creating test context: ${insertError.message}`);
            setStatus(`❌ Error creating test context: ${insertError.message}`);
            return;
          }
          addLog('✅ Test user context created');
        } else {
          addLog('✅ User context found');
        }

        // Check if documents exist
        addLog('📄 Checking for documents...');
        const { data: docs } = await supabase
          .from('contract_documents')
          .select('*')
          .eq('user_id', user.id);

        if (!docs || docs.length === 0) {
          addLog('❌ No documents found, creating test document...');
          setStatus('Creating test document...');
          
          const { error: docError } = await supabase
            .from('contract_documents')
            .insert({
              user_id: user.id,
              filename: 'test_offer_letter.pdf',
              file_type: 'offer',
              file_url: 'test://placeholder',
              uploaded_at: new Date().toISOString()
            });

          if (docError) {
            addLog(`❌ Error creating test document: ${docError.message}`);
            setStatus(`❌ Error creating test document: ${docError.message}`);
            return;
          }
          addLog('✅ Test document created (note: contains placeholder content)');
        } else {
          addLog(`✅ Found ${docs.length} document(s)`);
        }

        addLog('🤖 Starting AI analysis...');
        setStatus('Analyzing contracts...');

        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        addLog(`📡 API response status: ${res.status}`);

        if (!res.ok) {
          const errorText = await res.text();
          addLog(`❌ API error: ${errorText}`);
          throw new Error(`API error: ${res.status} - ${errorText}`);
        }

        const apiResult = await res.json();
        addLog(`✅ Analysis complete: ${JSON.stringify(apiResult)}`);
        setResult(apiResult);
        setStatus(`✅ Analysis Complete: Found ${apiResult.clauses?.length || 0} clauses`);

      } catch (err: any) {
        addLog(`❌ Error: ${err.message}`);
        console.error('[analyzeContract] Error:', err);
        setStatus(`❌ Error: ${err.message}`);
      }
    };

    runAnalysis();
  }, [user, router, supabase]);

  if (user === undefined) {
    return <div className="p-6">Loading...</div>;
  }

  if (user === null) {
    return <div className="p-6">Redirecting to login...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Contract Analysis Debug</h1>
      
      <div className="mb-4">
        <button 
          onClick={resetAndRunAnalysis}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Reset & Run New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Status</h2>
          <p><strong>User:</strong> {user.id}</p>
          <p><strong>Current Status:</strong> {status}</p>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Prerequisites:</p>
            <ul className="list-disc ml-4">
              <li>User context (will create test data if missing)</li>
              <li>Uploaded documents (will create test data if missing)</li>
            </ul>
            <p className="mt-2 text-xs">Note: Test documents use placeholder content since no text extraction is implemented yet.</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Activity Log</h2>
          <div className="bg-gray-100 p-3 rounded max-h-64 overflow-y-auto text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">No activity yet...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Result</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
