'use client';

import { useUser } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionDebugPage() {
  const user = useUser();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [storageInfo, setStorageInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionInfo = async () => {
      try {
        // Get current session
        const { data: sessionData, error } = await supabase.auth.getSession();
        setSessionInfo({ data: sessionData, error });

        // Get localStorage info
        if (typeof window !== 'undefined') {
          const storage = {
            lastLogin: localStorage.getItem('trusted-app-last-login'),
            userEmail: localStorage.getItem('trusted-app-user-email'),
            supabaseAuth: localStorage.getItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token'),
            allKeys: Object.keys(localStorage).filter(key => 
              key.includes('supabase') || 
              key.includes('auth') || 
              key.includes('trusted-app')
            )
          };
          setStorageInfo(storage);
        }
      } catch (error) {
        console.error('Error getting session info:', error);
      }
      setLoading(false);
    };

    getSessionInfo();
  }, []);

  const clearSession = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    router.push('/login');
  };

  const refreshSession = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.refreshSession();
    console.log('Refresh result:', { data, error });
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Debug</h1>
          <p className="text-gray-600">Debug authentication and session persistence</p>
        </div>

        <div className="grid gap-6">
          {/* User Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Status</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium mr-2">Authenticated:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              {user && (
                <>
                  <div><span className="font-medium">Email:</span> {user.email}</div>
                  <div><span className="font-medium">User ID:</span> {user.id}</div>
                  <div><span className="font-medium">Created:</span> {new Date(user.created_at || '').toLocaleString()}</div>
                  <div><span className="font-medium">Last Sign In:</span> {new Date(user.last_sign_in_at || '').toLocaleString()}</div>
                </>
              )}
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Details</h2>
            {sessionInfo?.data?.session ? (
              <div className="space-y-2">
                <div><span className="font-medium">Access Token:</span> {sessionInfo.data.session.access_token ? '✅ Present' : '❌ Missing'}</div>
                <div><span className="font-medium">Refresh Token:</span> {sessionInfo.data.session.refresh_token ? '✅ Present' : '❌ Missing'}</div>
                <div><span className="font-medium">Expires At:</span> {new Date(sessionInfo.data.session.expires_at * 1000).toLocaleString()}</div>
                <div><span className="font-medium">Token Type:</span> {sessionInfo.data.session.token_type}</div>
              </div>
            ) : (
              <p className="text-red-600">No active session found</p>
            )}
            
            {sessionInfo?.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700">Error: {sessionInfo.error.message}</p>
              </div>
            )}
          </div>

          {/* Storage Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Browser Storage</h2>
            <div className="space-y-2">
              <div><span className="font-medium">Last Login:</span> {storageInfo.lastLogin || 'Not recorded'}</div>
              <div><span className="font-medium">Stored Email:</span> {storageInfo.userEmail || 'Not stored'}</div>
              <div><span className="font-medium">Supabase Auth Token:</span> {storageInfo.supabaseAuth ? '✅ Present' : '❌ Missing'}</div>
              <div>
                <span className="font-medium">Auth-related Keys:</span>
                <ul className="mt-1 text-sm text-gray-600">
                  {storageInfo.allKeys?.length > 0 ? (
                    storageInfo.allKeys.map((key: string, index: number) => (
                      <li key={index} className="ml-4">• {key}</li>
                    ))
                  ) : (
                    <li className="ml-4 text-red-600">No auth keys found</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={refreshSession}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Refresh Session
              </button>
              <button
                onClick={clearSession}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Clear Session & Logout
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Back to Home
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Session Persistence Tips</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Sessions should persist across browser restarts automatically</li>
              <li>• If you're getting logged out frequently, check if cookies are enabled</li>
              <li>• Private/Incognito mode may not persist sessions</li>
              <li>• Browser extensions that clear storage can affect session persistence</li>
              <li>• Sessions expire after 1 hour but refresh automatically when active</li>
            </ul>
          </div>

          {/* Raw Data */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Session Data</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 