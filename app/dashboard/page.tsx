import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Upload, FileText, Clock, CheckCircle } from "lucide-react";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/auth/LogoutButton";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  console.log('SESSION:', session);

  if (!session) {
    redirect('/login');
  }

  const { data: documents, error } = await supabase
    .from('contract_documents')
    .select('id, document_name, created_at, status')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Your Documents</h1>
          <Link href="/upload" className="font-heading font-bold inline-flex items-center rounded-md bg-anchor px-3 py-2 text-sm text-white shadow-sm hover:bg-anchor-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-anchor-dark">
            <Upload className="-ml-0.5 mr-1.5 h-5 w-5" />
            Upload New Document
          </Link>
        </div>
        <div className="mb-6">
          <Link href="/intake" className="inline-block font-heading font-bold rounded-md bg-blue-100 text-blue-800 px-4 py-2 shadow-sm hover:bg-blue-200">
            Complete Your Profile
          </Link>
        </div>

        {documents && documents.length > 0 ? (
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <li key={doc.id}>
                  <Link href={`/review-summary/${doc.id}`} className="block hover:bg-gray-50">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="p-3 bg-indigo-100 rounded-full">
                             <FileText className="h-5 w-5 text-anchor" />
                           </div>
                           <div>
                            <p className="truncate font-semibold text-anchor font-heading">{doc.document_name}</p>
                            <p className="text-sm text-gray-500">Uploaded on {new Date(doc.created_at).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="ml-2 flex flex-shrink-0 items-center gap-2">
                          <p className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              doc.status === 'Complete' ? 'bg-green-100 text-green-800' :
                              doc.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {doc.status}
                          </p>
                           {doc.status === 'Complete' ? (
                             <CheckCircle className="h-5 w-5 text-green-500" />
                           ) : (
                             <Clock className="h-5 w-5 text-yellow-500" />
                           )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-semibold text-gray-900 font-heading">No documents uploaded</h3>
            <p className="mt-1 text-sm text-gray-500 font-body">Get started by uploading your first document.</p>
            <div className="mt-6">
              <Link href="/upload" className="font-heading font-bold inline-flex items-center rounded-md bg-anchor px-3 py-2 text-sm text-white shadow-sm hover:bg-anchor-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-anchor-dark">
                <Upload className="-ml-0.5 mr-1.5 h-5 w-5" />
                Upload Document
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
