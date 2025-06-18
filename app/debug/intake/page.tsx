"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

export default function DebugIntakePage() {
  const [userContext, setUserContext] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    fetchUserContext();
  }, [user]);

  const fetchUserContext = async () => {
    if (!user) {
      setError("No user logged in");
      setLoading(false);
      return;
    }

    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from("user_context")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    console.log('[DebugIntake] Query result:', { data, error });

    if (error) {
      setError(error.message);
    } else {
      setUserContext(data);
    }
    setLoading(false);
  };

  const deleteUserContext = async (id: string) => {
    const supabase = createClientComponentClient();
    const { error } = await supabase
      .from("user_context")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      alert("Deleted successfully");
      fetchUserContext(); // Refresh
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Debug: User Context</h1>
        <button 
          onClick={fetchUserContext}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {user && (
        <div className="mb-4">
          <strong>Logged in as:</strong> {user.email} (ID: {user.id})
        </div>
      )}

      {userContext && userContext.length > 0 ? (
        <div className="space-y-4">
          <p className="text-green-600 font-semibold">
            Found {userContext.length} user context record(s):
          </p>
          {userContext.map((context: any, index: number) => (
            <div key={context.id} className="border p-4 rounded bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">Record #{index + 1}</h3>
                <button
                  onClick={() => deleteUserContext(context.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Role:</strong> {context.role_title}</div>
                <div><strong>Level:</strong> {context.level}</div>
                <div><strong>Industry:</strong> {context.industry}</div>
                <div><strong>Situation:</strong> {context.situation}</div>
                <div><strong>Base Comp:</strong> ${context.target_comp_base?.toLocaleString()}</div>
                <div><strong>Total Comp:</strong> ${context.target_comp_total?.toLocaleString()}</div>
                <div><strong>Priorities:</strong> {context.priorities?.join(", ")}</div>
                <div><strong>Confidence:</strong> {context.confidence_rating}/5</div>
                <div><strong>Created:</strong> {new Date(context.created_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-yellow-600">
          No user context found. Try submitting the intake form first.
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">How to test:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Go to <a href="/intake" className="text-blue-600 underline">/intake</a></li>
          <li>Fill out and submit the form</li>
          <li>Come back here and click "Refresh"</li>
          <li>Check the browser console for detailed logs</li>
        </ol>
      </div>
    </div>
  );
} 