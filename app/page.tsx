'use client';

import { useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const user = useUser();
  const router = useRouter();

  // Handle redirects in useEffect to avoid render-time state updates
  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [user, router]);

  // If not logged in, show loading while redirecting
  if (user === null) {
    return <div className="p-6">Redirecting to login...</div>;
  }

  // Still loading user
  if (user === undefined) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contract Analysis App
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            AI-powered contract review for job offers
          </p>
          <p className="text-sm text-gray-500">
            Welcome back, {user.email}
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Step 1: Intake */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Setup Profile</h3>
            </div>
            <p className="text-gray-600 mb-4 text-center">
              Tell us about your role, experience level, and priorities to get personalized contract analysis.
            </p>
            <Link 
              href="/intake"
              className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Complete Profile
            </Link>
          </div>

          {/* Step 2: Upload */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Upload Documents</h3>
            </div>
            <p className="text-gray-600 mb-4 text-center">
              Upload your contract documents, offer letters, or job descriptions for analysis.
            </p>
            <Link 
              href="/upload"
              className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Upload Files
            </Link>
          </div>

          {/* Step 3: Analyze */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Get Analysis</h3>
            </div>
            <p className="text-gray-600 mb-4 text-center">
              Receive AI-powered insights and recommendations tailored to your career goals.
            </p>
            <Link 
              href="/debug/analyze"
              className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Run Analysis
            </Link>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">View Your Results</h3>
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Already completed your analysis? View your personalized contract summary and recommendations.
            </p>
            <Link 
              href="/review-summary"
              className="inline-block bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              View Analysis Summary
            </Link>
          </div>
        </div>

        {/* Debug Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug & Testing</h3>
          <div className="grid md:grid-cols-5 gap-4">
            <Link 
              href="/debug/database"
              className="text-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="font-medium text-blue-900">Database Status</div>
              <div className="text-sm text-blue-600">Check table setup</div>
            </Link>
            <Link 
              href="/debug/session"
              className="text-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="font-medium text-green-900">Session Debug</div>
              <div className="text-sm text-green-600">Login persistence</div>
            </Link>
            <Link 
              href="/debug/intake"
              className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium text-gray-900">Profile Debug</div>
              <div className="text-sm text-gray-600">View saved profile data</div>
            </Link>
            <Link 
              href="/debug/upload"
              className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium text-gray-900">Upload Debug</div>
              <div className="text-sm text-gray-600">View uploaded files</div>
            </Link>
            <Link 
              href="/debug/analyze"
              className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium text-gray-900">Analysis Debug</div>
              <div className="text-sm text-gray-600">Run contract analysis</div>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>User ID: {user.id}</p>
        </div>
      </div>
    </div>
  );
}
