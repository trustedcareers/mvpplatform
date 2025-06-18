'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createClientComponentClient());

  return (
    <SessionContextProvider 
      supabaseClient={supabaseClient}
      initialSession={null}
    >
      {children}
    </SessionContextProvider>
  );
}
