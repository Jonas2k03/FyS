import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useDashboardStorage } from '../../../hooks/useDashboardStorage';
import type { Song } from '../../../hooks/useDashboardStorage';

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  storage: ReturnType<typeof useDashboardStorage>;
}

export function AddSongModal({ isOpen, onClose, storage }: AddSongModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    url: '',
    note: '',
  });

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      return (
        hostname.includes('spotify.com') ||
        hostname.includes('youtube.com') ||
        hostname.includes('youtu.be')
      );
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.artist.trim() || !formData.url.trim()) {
      return;
    }

    if (!validateUrl(formData.url)) {
      alert('Por favor, ingresa una URL válida de Spotify o YouTube');
      return;
    }

    const song: Song = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      artist: formData.artist.trim(),
      url: formData.url.trim(),
      note: formData.note.trim() || undefined,
    };

    storage.saveSongs([...storage.songs, song]);
    setFormData({ title: '', artist: '', url: '', note: '' });
    onClose();
  };

  const handleClose = () => {
    setFormData({ title: '', artist: '', url: '', note: '' });
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
            onClick={handleClose}
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
            aria-labelledby="add-song-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] rounded-2xl border border-border shadow-[0_8px_20px_rgba(0,0,0,0.40)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 id="add-song-modal-title" className="text-xl font-bold text-text">
                  Agregar canción
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors focus:outline-none focus:ring-2 focus:ring-text"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-text" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="song-title" className="block text-sm font-medium text-text mb-2">
                      Título
                    </label>
                    <input
                      id="song-title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Título"
                      required
                      className="w-full px-4 py-2.5 bg-surface border-2 border-text rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-text focus:border-text"
                      aria-label="Título de la canción"
                    />
                  </div>
                  <div>
                    <label htmlFor="song-artist" className="block text-sm font-medium text-text mb-2">
                      Artista
                    </label>
                    <input
                      id="song-artist"
                      type="text"
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      placeholder="Artista"
                      required
                      className="w-full px-4 py-2.5 bg-surface border-2 border-text rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-text focus:border-text"
                      aria-label="Artista"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="song-url" className="block text-sm font-medium text-text mb-2">
                    URL
                  </label>
                  <input
                    id="song-url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="URL (Spotify o YouTube)"
                    required
                    className="w-full px-4 py-2.5 bg-surface border-2 border-text rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-text focus:border-text"
                    aria-label="URL de Spotify o YouTube"
                  />
                </div>

                <div>
                  <label htmlFor="song-note" className="block text-sm font-medium text-text mb-2">
                    Nota opcional
                  </label>
                  <textarea
                    id="song-note"
                    value={formData.note}
                    onChange={(e) => {
                      if (e.target.value.length <= 160) {
                        setFormData({ ...formData, note: e.target.value });
                      }
                    }}
                    placeholder="Nota opcional (máx. 160 caracteres)"
                    maxLength={160}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-surface border-2 border-text rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-text focus:border-text resize-none"
                    aria-label="Nota opcional"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-text-muted">
                      {formData.note.length}/160 caracteres
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-xl bg-surface border-2 border-text hover:bg-surface hover:border-text text-text transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-surface"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-surface border-2 border-text hover:bg-surface hover:border-text text-text transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-surface"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Agregar
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

