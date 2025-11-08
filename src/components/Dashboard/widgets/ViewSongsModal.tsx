import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Trash2 } from 'lucide-react';
import { useDashboardStorage } from '../../../hooks/useDashboardStorage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../ui/carousel';
import { Card, CardContent } from '../../ui/card';

interface ViewSongsModalProps {
  isOpen: boolean;
  onClose: () => void;
  storage: ReturnType<typeof useDashboardStorage>;
}

export function ViewSongsModal({ isOpen, onClose, storage }: ViewSongsModalProps) {
  const handleDelete = (id: string) => {
    storage.saveSongs(storage.songs.filter((song) => song.id !== id));
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
            aria-labelledby="view-songs-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] rounded-2xl border border-border shadow-[0_8px_20px_rgba(0,0,0,0.40)] max-w-5xl w-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
                <h2 id="view-songs-modal-title" className="text-xl font-bold text-text">
                  Nuestra música
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors focus:outline-none focus:ring-2 focus:ring-text"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-text" />
                </button>
              </div>

              <div className="p-8 md:p-10 overflow-y-auto flex-1">
                {storage.songs.length === 0 ? (
                  <p className="text-text-muted text-center py-12">
                    Aún no hay canciones. Agrega la primera desde el widget.
                  </p>
                ) : (
                  <div className="px-4 md:px-6 lg:px-8">
                    <Carousel
                      opts={{
                        align: 'start',
                        loop: storage.songs.length > 3,
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-4 md:-ml-6 lg:-ml-8">
                        {storage.songs.map((song) => (
                          <CarouselItem
                            key={song.id}
                            className="pl-4 md:pl-6 lg:pl-8 md:basis-1/2 lg:basis-1/3"
                          >
                            <div className="h-full">
                              <Card className="h-full">
                                <CardContent className="p-5 flex flex-col h-full">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="w-10 h-10 rounded-lg bg-subtle flex items-center justify-center flex-shrink-0">
                                    <Music className="w-5 h-5 text-text-muted" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-text text-base line-clamp-1 mb-1">
                                      {song.title}
                                    </h4>
                                    <p className="text-sm text-text-muted line-clamp-1 mb-1">
                                      {song.artist}
                                    </p>
                                    {song.note && (
                                      <p className="text-xs text-text-body line-clamp-2">
                                        {song.note}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex justify-end mt-4 pt-4 border-t border-border">
                                  <button
                                    onClick={() => handleDelete(song.id)}
                                    className="p-2 rounded-xl hover:bg-[rgba(0,0,0,0.05)] transition-colors focus:outline-none focus:ring-2 focus:ring-text"
                                    aria-label={`Eliminar ${song.title}`}
                                  >
                                    <Trash2 className="w-4 h-4 text-text-muted hover:text-danger" />
                                  </button>
                                </div>
                              </CardContent>
                            </Card>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {storage.songs.length > 3 && (
                        <>
                          <CarouselPrevious />
                          <CarouselNext />
                        </>
                      )}
                    </Carousel>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

