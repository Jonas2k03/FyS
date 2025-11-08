import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStorage } from '../../../hooks/useDashboardStorage';

interface MemoriesWidgetProps {
  storage: ReturnType<typeof useDashboardStorage>;
}

export function MemoriesWidget({ storage }: MemoriesWidgetProps) {
  const [newMemory, setNewMemory] = useState('');

  const handleAdd = () => {
    if (!newMemory.trim()) return;

    storage.saveMemories([...storage.memories, newMemory.trim()]);
    setNewMemory('');
  };

  const handleDelete = (index: number) => {
    const newMemories = storage.memories.filter((_, i) => i !== index);
    storage.saveMemories(newMemories);
  };

  const cardClass = "bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] rounded-2xl border border-border shadow-[0_8px_20px_rgba(0,0,0,0.40)] p-6 md:p-7";

  return (
    <div className={cardClass}>
      <h3 className="text-lg font-semibold text-text mb-4">Recuerdos / Frases</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newMemory}
          onChange={(e) => setNewMemory(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAdd();
            }
          }}
          placeholder="Añade una frase o recuerdo..."
          className="flex-1 px-4 py-2.5 bg-surface border-2 border-text rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-text focus:border-text"
          aria-label="Nueva frase o recuerdo"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-xl bg-surface border-2 border-text text-text hover:bg-surface hover:border-text transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-surface"
          aria-label="Añadir frase"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AnimatePresence>
          {storage.memories.length === 0 ? (
            <p className="text-text-muted text-sm col-span-2 text-center py-4">
              Aún no hay frases, añade la primera
            </p>
          ) : (
            storage.memories.map((memory, index) => (
              <motion.div
                key={`${memory}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-surface border-2 border-text rounded-lg p-3 flex items-start justify-between gap-2 group"
              >
                <p className="text-text text-sm flex-1 break-words">{memory}</p>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-1 rounded-xl hover:bg-[rgba(0,0,0,0.05)] transition-colors focus:outline-none focus:ring-2 focus:ring-text opacity-0 group-hover:opacity-100 flex-shrink-0"
                  aria-label={`Eliminar frase: ${memory}`}
                >
                  <X className="w-4 h-4 text-text-muted hover:text-danger" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

