'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { createNote } from '@/lib/localStorage';

interface Props {
  leadId: string;
  onCreated?: () => void;
}

export function AddNoteForm({ leadId, onCreated }: Props) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setLoading(true);
    createNote({
      lead_id: leadId,
      note: note.trim(),
    });

    setNote('');
    setLoading(false);
    onCreated?.();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Agregar una nota..."
          rows={2}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none resize-none"
        />
        <button
          type="submit"
          disabled={loading || !note.trim()}
          className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 self-end"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}
