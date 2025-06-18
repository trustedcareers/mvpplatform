'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [context, setContext] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('user_context').select('*');
      if (error) console.error('Supabase error:', error);
      else setContext(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">User Context Table</h1>
      <pre>{JSON.stringify(context, null, 2)}</pre>
    </div>
  );
}
