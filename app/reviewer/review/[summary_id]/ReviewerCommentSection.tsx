"use client";
import React, { useState, useEffect } from "react";
// If Lucide icons are available, import Trash. Otherwise, fallback to emoji.
// import { Trash } from 'lucide-react';

export default function ReviewerCommentSection({ prebriefId }: { prebriefId: string }) {
  const [notes, setNotes] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [coachingAngle, setCoachingAngle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchNotes = async () => {
    const res = await fetch(`/api/reviewer-notes?review_prebrief_id=${prebriefId}`);
    if (res.ok) {
      const data = await res.json();
      setNotes(data.notes || []);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prebriefId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/reviewer-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_prebrief_id: prebriefId, comment, coaching_angle: coachingAngle })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to submit');
      setSuccess('Comment submitted!');
      setComment("");
      setCoachingAngle("");
      await fetchNotes();
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    setDeletingId(noteId);
    setError(null);
    try {
      const res = await fetch('/api/reviewer-notes/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: noteId })
      });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchNotes();
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Reviewer Comment Form */}
      <div>
        <h3 className="font-semibold mb-2 text-base">Add Reviewer Comment</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} required className="w-full p-2 border rounded" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coaching Angle (optional)</label>
            <input value={coachingAngle} onChange={e => setCoachingAngle(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">
            {submitting ? 'Submitting...' : 'Submit Comment'}
          </button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {success && <div className="text-green-600 mt-2">{success}</div>}
        </form>
      </div>
      {/* Divider */}
      {notes.length > 0 && <hr className="my-4 border-gray-200" />}
      {/* Previous Reviewer Comments */}
      {notes.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2 text-base">Previous Reviewer Comments</h3>
          <ul className="space-y-2">
            {notes.map(note => (
              <li key={note.id} className="p-3 bg-gray-100 rounded border flex items-center justify-between">
                <div>
                  <div className="text-gray-800 mb-1">{note.comment}</div>
                  {note.coaching_angle && <div className="text-xs text-gray-600 mb-1">Coaching Angle: {note.coaching_angle}</div>}
                  <div className="text-xs text-gray-500">{new Date(note.created_at).toLocaleString()}</div>
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  disabled={deletingId === note.id}
                  className="ml-4 flex items-center gap-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded text-xs font-medium border border-transparent hover:border-red-200 transition"
                  title="Delete comment"
                >
                  {/* <Trash size={16} /> */}
                  <span role="img" aria-label="Delete">🗑️</span>
                  {deletingId === note.id ? 'Deleting...' : 'Delete'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 