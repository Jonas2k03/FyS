import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStorage } from '../../../hooks/useDashboardStorage';
import type { Note } from '../../../hooks/useDashboardStorage';

interface NotesWidgetProps {
  storage: ReturnType<typeof useDashboardStorage>;
}

export function NotesWidget({ storage }: NotesWidgetProps) {
  const [newNote, setNewNote] = useState('');

  const handleAdd = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      text: newNote.trim(),
      ts: Date.now(),
    };

    storage.saveNotes([note, ...storage.notes]);
    setNewNote('');
  };

  const handleDelete = (id: string) => {
    storage.saveNotes(storage.notes.filter((note) => note.id !== id));
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const cardClass = "bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] rounded-2xl border border-border shadow-[0_8px_20px_rgba(0,0,0,0.40)] p-6 md:p-7";

  return (
    <div className={cardClass}>
      <h3 className="text-lg font-semibold text-text mb-4">Notas para Sebas</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAdd();
            }
          }}
          placeholder="Escribe algo bonito..."
          className="flex-1 px-4 py-2.5 bg-surface border-2 border-text rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-text focus:border-text"
          aria-label="Nueva nota"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-xl bg-surface border-2 border-text text-text hover:bg-surface hover:border-text transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-surface"
          aria-label="Añadir nota"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {storage.notes.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-4">
              Escribe algo bonito para Sebas
            </p>
          ) : (
            storage.notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-surface border-2 border-text rounded-lg p-3 flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-text text-sm break-words">{note.text}</p>
                  <p className="text-text-muted text-xs mt-1">{formatDate(note.ts)}</p>
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-1 rounded-xl hover:bg-[rgba(0,0,0,0.05)] transition-colors focus:outline-none focus:ring-2 focus:ring-text flex-shrink-0"
                  aria-label={`Eliminar nota del ${formatDate(note.ts)}`}
                >
                  <Trash2 className="w-4 h-4 text-text-muted hover:text-danger" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

