"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { Upload, File, X, Eye, Trash2, RefreshCw, CheckCircle, AlertCircle, Plus, FileText, Calendar, Tag } from 'lucide-react';

const FILE_TYPES = [
  { value: "offer", label: "Job Offer" },
  { value: "jd", label: "Job Description" },
  { value: "email", label: "Email Communication" },
  { value: "other", label: "Other Document" }
];

interface Document {
  id: string;
  filename: string;
  file_type: string;
  notes: string;
  file_url: string;
  uploaded_at: string;
}

export default function UploadForm() {
  const user = useUser();
  const [files, setFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState("");
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) {
      setLoadingDocuments(false);
      return;
    }

    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from("contract_documents")
      .select("*")
      .eq("user_id", user.id)
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
    } else {
      setDocuments(data || []);
    }
    setLoadingDocuments(false);
  };

  const deleteDocument = async (id: string, filename: string, fileUrl: string) => {
    const supabase = createClientComponentClient();
    
    try {
      // Delete from database
      const { error } = await supabase
        .from("contract_documents")
        .delete()
        .eq("id", id);

      if (error) {
        setError("Error deleting document: " + error.message);
        return;
      }

      // Try to delete from storage
      try {
        const urlParts = fileUrl.split('/contracts/')[1];
        if (urlParts) {
          await supabase.storage.from("contracts").remove([urlParts]);
        }
      } catch (e) {
        console.warn("Could not delete from storage:", e);
      }

      setSuccess(`Successfully deleted "${filename}"`);
      setDeleteConfirm(null);
      fetchDocuments(); // Refresh the list
    } catch (e) {
      setError("Failed to delete document");
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("Please log in to upload files");
      return;
    }

    if (files.length === 0) {
      setError("Please select files to upload");
      return;
    }

    if (!fileType) {
      setError("Please select a file type");
      return;
    }

    console.log('[UploadForm] Starting server-side upload for user:', user.id);
    console.log('[UploadForm] Files to upload:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
    
    setUploading(true);
    setError(null);
    setSuccess(null);
    setUploaded([]);

    for (const file of files) {
      console.log('[UploadForm] Processing file:', file.name);
      
      try {
        // Convert file to base64 for API transfer
        const fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove data:mime/type;base64, prefix
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        console.log('[UploadForm] File converted to base64, uploading via API...');

        // Send to server-side API
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type || 'application/octet-stream',
            notes: notes,
            fileData: fileData
          })
        });

        const result = await response.json();
        console.log('[UploadForm] API response:', result);

        if (!response.ok) {
          throw new Error(result.error || 'Upload failed');
        }

        console.log('[UploadForm] Successfully uploaded:', file.name);
        setUploaded((prev) => [...prev, file.name]);

      } catch (error) {
        console.error('[UploadForm] Upload error:', error);
        setError(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setUploading(false);
        return;
      }
    }
    
    setUploading(false);
    setFiles([]);
    setNotes("");
    setFileType("");
    setSuccess(`Successfully uploaded ${files.length} file(s)!`);
    fetchDocuments(); // Refresh the documents list
    console.log('[UploadForm] All uploads completed successfully');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-600 mb-4">Please log in to upload documents.</p>
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Documents</h1>
          <p className="text-gray-600">Upload your contract documents for AI-powered analysis</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">✅ {success}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">❌ {error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="p-6 mb-8 bg-white rounded-lg shadow">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Modern Drag-and-Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out cursor-pointer ${
                  files.length === 0 ? "border-gray-300 hover:border-gray-400 hover:bg-gray-50" : "border-blue-500 bg-blue-50 scale-[1.01]"
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
                  <div className={`rounded-full p-4 transition-colors ${files.length === 0 ? "bg-gray-100" : "bg-blue-100"}`}>
                    <Upload className={`w-8 h-8 transition-colors ${files.length === 0 ? "text-gray-500" : "text-blue-600"}`} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {files.length === 0 ? "Click to upload or drag and drop" : `${files.length} file(s) selected`}
                    </p>
                    <p className="text-sm text-gray-500">Supports PDF, DOCX, and TXT files</p>
                  </div>
                  <input id="file-input" type="file" multiple onChange={handleFiles} className="hidden" />
                </div>
              </div>
              
              {/* File Preview */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900">Selected Files</h3>
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <File className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{file.name}</span>
                      </div>
                      <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>
                        <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* File Type Dropdown */}
              <div className="space-y-2">
                <label htmlFor="fileType" className="block text-sm font-medium text-gray-700">File Type*</label>
                <select 
                  id="fileType" 
                  value={fileType} 
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select file type...</option>
                  {FILE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Notes Textarea */}
              <div className="space-y-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea 
                  id="notes" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 'Initial offer for Senior Developer role'"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading || files.length === 0}
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300 h-10 px-4 py-2"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Uploaded Documents Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Your Documents</h2>
            </div>
            <div className="p-6">
              {loadingDocuments ? (
                <div className="flex justify-center items-center h-48">
                  <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No Documents Uploaded</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Use the form to upload your first document for analysis.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {documents.map((doc) => (
                    <li key={doc.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{doc.filename}</p>
                          <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              <Tag className="w-3 h-3 mr-1" />
                              {FILE_TYPES.find(t => t.value === doc.file_type)?.label || "Other"}
                            </span>
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(doc.uploaded_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 text-gray-500 hover:text-gray-800">
                          <Eye className="w-5 h-5" />
                        </a>
                        
                        {deleteConfirm === doc.id ? (
                          <>
                            <button
                              onClick={() => deleteDocument(doc.id, doc.filename, doc.file_url)}
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-10 px-3"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(doc.id)}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 