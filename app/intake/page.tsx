"use client";
import IntakeForm from "@/components/features/intake/IntakeForm";
import Link from "next/link";

export default function IntakePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Profile</h1>
          <p className="text-lg text-gray-600 mb-2">
            Help us personalize your contract analysis
          </p>
          <p className="text-sm text-gray-500">
            This information helps our AI provide recommendations tailored to your career goals and priorities.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <IntakeForm />
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Your profile data is used to personalize contract analysis and recommendations.</p>
          <p>You can update this information anytime by revisiting this page.</p>
        </div>
        
        <div className="mt-10 flex justify-center">
          <Link href="/dashboard" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
} 