import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useDashboardStorage } from '../../hooks/useDashboardStorage';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  storage: ReturnType<typeof useDashboardStorage>;
}

export function ConfigModal({ isOpen, onClose, storage }: ConfigModalProps) {
  const [startDate, setStartDate] = useState(storage.startDate);

  useEffect(() => {
    setStartDate(storage.startDate);
  }, [storage.startDate, isOpen]);

  const handleSave = () => {
    if (startDate) {
      storage.saveStartDate(startDate);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="config-modal-title"
          >
            <div className="bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] rounded-2xl border border-border shadow-[0_8px_20px_rgba(0,0,0,0.40)] max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 id="config-modal-title" className="text-xl font-bold text-text">
                  Configuración
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors focus:outline-none focus:ring-2 focus:ring-text"
                  aria-label="Cerrar configuración"
                >
                  <X className="w-5 h-5 text-text" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Start Date */}
                <div>
                  <label
                    htmlFor="start-date"
                    className="block text-sm font-medium text-text mb-2"
                  >
                    Fecha de inicio
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border-2 border-text rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-text focus:border-text"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-surface border-2 border-text hover:bg-surface hover:border-text text-text transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-surface"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2.5 rounded-xl bg-surface border-2 border-text text-text hover:bg-surface hover:border-text transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-surface"
                >
                  Guardar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

