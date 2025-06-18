'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClientComponentClient();
        
        setStatus('Verifying your login...');
        
        // Handle the auth callback - this processes the magic link
        const { data: authData, error: authError } = await supabase.auth.getSession();
        
        console.log('[Auth Callback] Session data:', authData.session?.user?.email);
        
        if (authError) {
          console.error('[Auth Callback] Auth error:', authError.message);
          setStatus('Login failed. Redirecting...');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        if (authData.session?.user) {
          console.log('[Auth Callback] Login successful for:', authData.session.user.email);
          setStatus('Login successful! Redirecting to your dashboard...');
          
          // Store session info in localStorage for debugging
          if (typeof window !== 'undefined') {
            localStorage.setItem('trusted-app-last-login', new Date().toISOString());
            localStorage.setItem('trusted-app-user-email', authData.session.user.email || '');
          }
          
          // Small delay to show success message
          setTimeout(() => {
            router.push('/');
          }, 1500);
        } else {
          console.log('[Auth Callback] No session found');
          setStatus('No valid session. Redirecting to login...');
          setTimeout(() => router.push('/login'), 2000);
        }
      } catch (error) {
        console.error('[Auth Callback] Unexpected error:', error);
        setStatus('Something went wrong. Redirecting...');
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Almost there!</h1>
        <p className="text-gray-600 mb-4">{status}</p>
        <div className="text-sm text-gray-500">
          <p>Setting up your persistent session...</p>
        </div>
      </div>
    </div>
  );
}
