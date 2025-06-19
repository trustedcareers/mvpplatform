"use client";
import React, { useState } from "react";

export function ReviewerNotesClient({ prebriefId, initialNotes }: { prebriefId: string, initialNotes: any[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [comment, setComment] = useState("");
  const [coachingAngle, setCoachingAngle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchNotes = async () => {
    const res = await fetch(`/api/reviewer-notes?review_prebrief_id=${prebriefId}`);
    if (res.ok) {
      const data = await res.json();
      setNotes(data.notes || []);
    }
  };

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

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded border">
        <h3 className="font-semibold mb-2">Add Reviewer Comment</h3>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Comment</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} required className="w-full p-2 border rounded" rows={3} />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Coaching Angle (optional)</label>
          <input value={coachingAngle} onChange={e => setCoachingAngle(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">
          {submitting ? 'Submitting...' : 'Submit Comment'}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </form>
      {notes.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Previous Reviewer Comments</h3>
          <ul className="space-y-2">
            {notes.map(note => (
              <li key={note.id} className="p-3 bg-gray-100 rounded border">
                <div className="text-gray-800 mb-1">{note.comment}</div>
                {note.coaching_angle && <div className="text-xs text-gray-600 mb-1">Coaching Angle: {note.coaching_angle}</div>}
                <div className="text-xs text-gray-500">{new Date(note.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 