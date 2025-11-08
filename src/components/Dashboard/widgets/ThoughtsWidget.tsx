import { useState } from 'react';
import { RefreshCw, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStorage } from '../../../hooks/useDashboardStorage';

interface ThoughtsWidgetProps {
  storage: ReturnType<typeof useDashboardStorage>;
}

export function ThoughtsWidget({ storage }: ThoughtsWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getRandomMemory = () => {
    if (storage.memories.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * storage.memories.length);
    setCurrentIndex(randomIndex);
    return storage.memories[randomIndex];
  };

  const handleChange = () => {
    if (storage.memories.length > 1) {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * storage.memories.length);
      } while (newIndex === currentIndex && storage.memories.length > 1);
      setCurrentIndex(newIndex);
    } else {
      getRandomMemory();
    }
  };

  const currentMemory = storage.memories.length > 0 
    ? storage.memories[currentIndex] 
    : null;

  const cardClass = "bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] rounded-2xl border border-border shadow-[0_8px_20px_rgba(0,0,0,0.40)] h-full flex flex-col p-6 md:p-7";

  if (storage.memories.length === 0) {
    return (
      <div className={cardClass}>
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-primary flex-shrink-0" />
          <h3 className="text-lg font-semibold text-text">Hoy pienso en…</h3>
        </div>
        <div className="flex-1 flex items-center">
          <p className="text-text-muted text-sm">
            Aún no hay frases, añade la primera en Recuerdos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-primary flex-shrink-0" />
          <h3 className="text-lg font-semibold text-text">Hoy pienso en…</h3>
        </div>
        <button
          onClick={handleChange}
          className="p-2 rounded-xl bg-transparent hover:bg-[rgba(0,0,0,0.05)] transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-surface"
          aria-label="Cambiar frase"
        >
          <RefreshCw className="w-4 h-4 text-text-muted hover:text-text" />
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="text-text-body text-xl md:text-2xl lg:text-3xl leading-relaxed text-center"
          >
            "{currentMemory}"
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

