import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

export interface UserContext {
  id: string;
  user_id: string;
  role_type: string;
  experience_level: string;
  industry: string;
  career_goals: string[];
  created_at: string;
}

export function useUserContext() {
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    async function fetchUserContext() {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_context')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setUserContext(data);
      } catch (err: any) {
        console.error('Error fetching user context:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserContext();
  }, [user, supabase]);

  return { userContext, loading, error };
} 