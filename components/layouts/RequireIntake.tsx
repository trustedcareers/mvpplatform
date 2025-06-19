import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/lib/hooks/useUserContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!userContext) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-2xl">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Profile Required</AlertTitle>
            <AlertDescription className="mt-2">
              Please complete your profile before proceeding. This helps us provide personalized analysis of your contract.
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex justify-center">
            <Button onClick={() => router.push('/intake')}>
              Complete Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 