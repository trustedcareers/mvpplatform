import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/lib/hooks/useUserContext';
import { AlertCircle } from "lucide-react";

interface RequireIntakeProps {
  children: React.ReactNode;
}

export function RequireIntake({ children }: RequireIntakeProps) {
  const { userContext, loading, error } = useUserContext();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-2xl">
          <div className="relative w-full rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7">
            <AlertCircle className="h-4 w-4" />
            <h5 className="mb-1 font-medium leading-none tracking-tight">Error</h5>
            <div className="text-sm">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userContext) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-2xl">
          <div className="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7">
            <AlertCircle className="absolute left-4 top-4 h-4 w-4" />
            <h5 className="mb-1 font-medium leading-none tracking-tight">Profile Required</h5>
            <div className="text-sm [&_p]:leading-relaxed mt-2">
              Please complete your profile before proceeding. This helps us provide personalized analysis of your contract.
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push('/intake')}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Complete Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 