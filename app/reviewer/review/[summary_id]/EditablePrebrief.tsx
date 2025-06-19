"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditablePrebrief({ prebrief }: { prebrief: any }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(prebrief.summary || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [localSummary, setLocalSummary] = useState(prebrief.summary || '');
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/reviewer-prebrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: prebrief.id, summary: value })
      });
      if (!res.ok) throw new Error('Failed to save');
      setLocalSummary(value);
      setSuccess('Saved!');
      setEditing(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Pre-Brief</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-blue-600 hover:underline text-sm font-medium">Edit</button>
        )}
      </div>
      {editing ? (
        <div>
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows={4}
            value={value}
            onChange={e => setValue(e.target.value)}
            disabled={saving}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 font-medium"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => { setEditing(false); setValue(localSummary); setError(null); }}
              disabled={saving}
              className="bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {success && <div className="text-green-600 mt-2">{success}</div>}
        </div>
      ) : (
        <div className="whitespace-pre-line text-gray-800">{localSummary || '(No pre-brief content found)'}</div>
      )}
    </div>
  );
} 