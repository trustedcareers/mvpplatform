'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/auth/LogoutButton';
import { FileText, Clock, CheckCircle, Upload, Plus } from 'lucide-react';

interface Document {
  id: string;
  filename: string;
  uploaded_at: string;
  status: 'Pending' | 'In Progress' | 'Complete' | 'Failed';
}

export default function Dashboard() {
  const user = useUser();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.push('/login');
      return;
    }
    
    if (user) {
      fetchDocuments();
    }
  }, [user, router]);
  
  const fetchDocuments = async () => {
    if (!user) return;
    setLoading(true);
    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from('contract_documents')
      .select('id, filename, uploaded_at, status')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      // Handle error display
    } else {
      setDocuments(data as Document[]);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div>Loading...</div>
      </div>
    );
  }

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'Complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
               <FileText className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
             <p className="text-sm text-gray-500 hidden sm:block">
              {user.email}
            </p>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-8 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0 mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Your Documents</h2>
              <p className="mt-1 text-gray-600">
                Manage your uploaded documents and view their analysis status.
              </p>
            </div>
            <Link href="/upload" className="inline-flex items-center gap-2 justify-center rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm h-10 px-4 py-2">
              <Plus className="h-4 w-4" />
              Upload New
            </Link>
          </div>
          
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-12 text-center">Loading documents...</div>
              ) : documents.length === 0 ? (
                <div className="p-12 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No documents uploaded</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by uploading your first document.</p>
                  <div className="mt-6">
                     <Link href="/upload" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                       <Upload className="-ml-0.5 mr-1.5 h-5 w-5" />
                      Upload Document
                    </Link>
                  </div>
                </div>
              ) : (
                documents.map((doc) => (
                  <Link href={`/review-summary/${doc.id}`} key={doc.id} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium text-blue-600">{doc.filename}</p>
                        <div className="ml-2 flex flex-shrink-0">
                          <p className={`inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 ${
                              doc.status === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {doc.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {getStatusIcon(doc.status)}
                            <span className="ml-1.5">
                              Uploaded on {new Date(doc.uploaded_at).toLocaleDateString()}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
