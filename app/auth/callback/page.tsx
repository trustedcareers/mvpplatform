'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClientComponentClient();
    
    const handleAuthCallback = async () => {
      // The auth code is exchanged for a session automatically by the Supabase client.
      // We just need to wait for the user to be available.
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Redirect to the dashboard after a successful sign-in.
        router.push('/dashboard');
      } else {
        // If no user is found, something went wrong. Redirect to login.
        router.push('/login?error=Authentication failed. Please try again.');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anchor mx-auto mb-6"></div>
        <h1 className="text-2xl font-semibold text-gray-900 font-heading">Authenticating...</h1>
        <p className="text-gray-600 mt-2 font-body">Please wait while we securely log you in.</p>
      </div>
    </div>
  );
}
