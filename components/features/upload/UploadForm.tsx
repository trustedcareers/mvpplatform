"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { Upload, File, X, Eye, Trash2, RefreshCw, CheckCircle, AlertCircle, Plus, FileText, Calendar, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

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
          <Card className="p-6 mb-8">
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
                    <p className="text-lg font-medium">
                      {files.length === 0 ? "Drag files here" : `${files.length} file${files.length !== 1 ? "s" : ""} selected`}
                    </p>
                    <p className="text-sm text-gray-500">
                      or <span className="text-blue-600 font-medium">click to browse</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                    <Badge variant="outline">PDF</Badge>
                    <Badge variant="outline">DOC</Badge>
                    <Badge variant="outline">DOCX</Badge>
                    <Badge variant="outline">TXT</Badge>
                    <span className="text-gray-400">• Max 10MB each</span>
                  </div>
                </div>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleFiles}
                />
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-gray-600">Uploaded Files ({files.length})</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <File className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            onClick={e => {
                              e.stopPropagation();
                              setFiles(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="flex-shrink-0 h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1" disabled={uploading}>
                      Upload {files.length} file{files.length !== 1 ? "s" : ""}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFiles([])}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              )}

              {/* File Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type *
                </label>
                <select 
                  value={fileType} 
                  onChange={e => setFileType(e.target.value)} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select document type...</option>
                  {FILE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <input 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)} 
                  placeholder="Add any additional context or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>
          </Card>

          {/* Existing Documents Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Documents</h2>
              <button
                onClick={fetchDocuments}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Refresh
              </button>
            </div>

            {loadingDocuments ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading documents...</p>
              </div>
            ) : documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-lg mr-2">
                            {doc.file_type === 'offer' ? '📋' : 
                             doc.file_type === 'jd' ? '📝' : 
                             doc.file_type === 'email' ? '📧' : '📄'}
                          </span>
                          <h3 className="font-medium text-gray-900">{doc.filename}</h3>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium">Type:</span> {FILE_TYPES.find(t => t.value === doc.file_type)?.label || doc.file_type}</p>
                          {doc.notes && <p><span className="font-medium">Notes:</span> {doc.notes}</p>}
                          <p><span className="font-medium">Uploaded:</span> {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </a>
                        <button
                          onClick={() => setDeleteConfirm(doc.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No documents uploaded yet</p>
                <p className="text-sm text-gray-400">Upload your first document to get started with AI analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this document? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const doc = documents.find(d => d.id === deleteConfirm);
                    if (doc) {
                      deleteDocument(doc.id, doc.filename, doc.file_url);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Ready to analyze your documents?</p>
          <div className="space-x-4">
            <a
              href="/debug/analyze"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Run Analysis
            </a>
            <a
              href="/"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 font-medium"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 