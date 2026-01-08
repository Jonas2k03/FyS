import { motion } from 'framer-motion';
import { Heart, Flower2 } from 'lucide-react';
import { useState } from 'react';
import { useDashboardStorage } from '../../hooks/useDashboardStorage';
import { DaysWidget } from './widgets/DaysWidget';
import { ThoughtsWidget } from './widgets/ThoughtsWidget';
import { PhotosWidget } from './widgets/PhotosWidget';
import { NotesWidget } from './widgets/NotesWidget';
import { TriquiWidget } from './widgets/TriquiWidget';
import { MusicWidgetCompact } from './widgets/MusicWidgetCompact';
import { FlowerModal } from '../FlowerModal/FlowerModal';

interface DashboardProps {
  onShowWelcome?: () => void;
}

export function Dashboard({ onShowWelcome }: DashboardProps) {
  const storage = useDashboardStorage();
  const [isFlowerModalOpen, setIsFlowerModalOpen] = useState(false);

  if (!storage.isLoaded) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-text">
        <p className="text-subtle">Cargando...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-text">
                Felipe Y Sebas
              </h1>
              <p className="text-sm sm:text-base text-text-muted mt-1">
                Un espacio que crece con nosotros
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFlowerModalOpen(true)}
                className="p-2 rounded-xl bg-transparent hover:bg-[rgba(0,0,0,0.05)] transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-surface"
                aria-label="Ver mensaje especial"
                title="Mensaje especial"
              >
                <Flower2 className="w-5 h-5 text-text-muted hover:text-text" />
              </button>
              {onShowWelcome && (
                <button
                  onClick={onShowWelcome}
                  className="p-2 rounded-xl bg-transparent hover:bg-[rgba(0,0,0,0.05)] transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-surface"
                  aria-label="Volver a la pantalla de bienvenida"
                  title="Volver a la bienvenida"
                >
                  <Heart className="w-5 h-5 text-text-muted hover:text-text" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 md:space-y-8"
        >
          {/* Fila 1: 3 columnas iguales */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            <motion.div variants={itemVariants} className="h-full">
              <DaysWidget storage={storage} />
            </motion.div>

            <motion.div variants={itemVariants} className="h-full">
              <ThoughtsWidget storage={storage} />
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-1 h-full">
              <MusicWidgetCompact storage={storage} />
            </motion.div>
          </div>

          {/* Fila 2: Carrusel de fotos (ancho completo) */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <PhotosWidget storage={storage} />
          </motion.div>

          {/* Fila 3: Notas (2 cols) + Recuerdos (1 col) */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <NotesWidget storage={storage} />
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-1">
              <TriquiWidget />
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-t border-border mt-12 py-6"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-8 text-center">
          <p className="text-sm text-text-muted">
            Hecho por Felipe — {new Date().getFullYear()} · Con amor para Sebas
          </p>
        </div>
      </motion.footer>

      {/* Flower Modal */}
      <FlowerModal isOpen={isFlowerModalOpen} onClose={() => setIsFlowerModalOpen(false)} />
    </div>
  );
}
