"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

export default function DebugUploadPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) {
      setError("No user logged in");
      setLoading(false);
      return;
    }

    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from("contract_documents")
      .select("*")
      .eq("user_id", user.id)
      .order("uploaded_at", { ascending: false });

    console.log('[DebugUpload] Query result:', { data, error });

    if (error) {
      setError(error.message);
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };

  const deleteDocument = async (id: string, fileUrl: string) => {
    const supabase = createClientComponentClient();
    
    // Delete from database
    const { error } = await supabase
      .from("contract_documents")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error deleting: " + error.message);
      return;
    }

    // Optionally delete from storage (extract path from URL)
    try {
      const urlParts = fileUrl.split('/contracts/')[1];
      if (urlParts) {
        const { error: storageError } = await supabase.storage
          .from("contracts")
          .remove([urlParts]);
        
        if (storageError) {
          console.warn("Storage deletion failed:", storageError);
        }
      }
    } catch (e) {
      console.warn("Could not delete from storage:", e);
    }

    alert("Document deleted successfully");
    fetchDocuments(); // Refresh
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Debug: Uploaded Documents</h1>
        <button 
          onClick={fetchDocuments}
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

      {documents.length > 0 ? (
        <div className="space-y-4">
          <p className="text-green-600 font-semibold">
            Found {documents.length} uploaded document(s):
          </p>
          {documents.map((doc, index) => (
            <div key={doc.id} className="border p-4 rounded bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">Document #{index + 1}</h3>
                <button
                  onClick={() => deleteDocument(doc.id, doc.file_url)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Filename:</strong> {doc.filename}</div>
                <div><strong>Type:</strong> {doc.file_type}</div>
                <div><strong>Notes:</strong> {doc.notes || "(notes column not available)"}</div>
                <div><strong>Uploaded:</strong> {new Date(doc.uploaded_at).toLocaleString()}</div>
                <div className="col-span-2">
                  <strong>File URL:</strong> 
                  <a 
                    href={doc.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline ml-2 break-all"
                  >
                    {doc.file_url}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-yellow-600">
          No documents found. Try uploading some files first.
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">How to test:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Go to <a href="/upload" className="text-blue-600 underline">/upload</a></li>
          <li>Upload some files</li>
          <li>Come back here and click "Refresh"</li>
          <li>Check the browser console for detailed logs</li>
          <li>Click the file URLs to verify they're accessible</li>
        </ol>
      </div>
    </div>
  );
} 