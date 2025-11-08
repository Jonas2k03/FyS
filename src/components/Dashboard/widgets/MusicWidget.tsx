import { useState } from 'react';
import { Plus, Play, X, Music, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStorage } from '../../../hooks/useDashboardStorage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../ui/carousel';
import { Card, CardContent } from '../../ui/card';
import { AddSongModal } from './AddSongModal';

interface MusicWidgetProps {
  storage: ReturnType<typeof useDashboardStorage>;
}

export function MusicWidget({ storage }: MusicWidgetProps) {
  const [expandedSong, setExpandedSong] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getEmbedUrl = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      if (hostname.includes('spotify.com')) {
        const trackId = urlObj.pathname.split('/').pop();
        if (trackId) {
          return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
        }
      } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        let videoId = '';
        if (hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1);
        } else {
          videoId = urlObj.searchParams.get('v') || '';
        }
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
    } catch {
      return null;
    }
    return null;
  };

  const handleDelete = (id: string) => {
    storage.saveSongs(storage.songs.filter((song) => song.id !== id));
    if (expandedSong === id) {
      setExpandedSong(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedSong(expandedSong === id ? null : id);
  };

  return (
    <>
      <div className="bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] rounded-2xl border border-border shadow-[0_8px_20px_rgba(0,0,0,0.40)] p-6 md:p-7">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text">Nuestra música</h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-surface border-2 border-text text-text hover:bg-surface hover:border-text transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text"
            aria-label="Agregar canción"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Songs Carousel */}
      {storage.songs.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-8">
          Agrega la primera canción que te recuerde a él
        </p>
      ) : (
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {storage.songs.map((song) => {
              const embedUrl = getEmbedUrl(song.url);
              const isExpanded = expandedSong === song.id;

              return (
                <CarouselItem key={song.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        {/* Song Header */}
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-subtle flex items-center justify-center flex-shrink-0">
                              <Music className="w-6 h-6 text-text-muted" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-text text-base line-clamp-1">{song.title}</h4>
                              <p className="text-sm text-text-muted line-clamp-1">{song.artist}</p>
                              {song.note && (
                                <p className="text-xs text-text-body mt-1 line-clamp-2">{song.note}</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center justify-between mt-4 gap-2">
                            {embedUrl && (
                              <button
                                onClick={() => toggleExpand(song.id)}
                                className="flex-1 px-3 py-2 rounded-xl bg-surface border-2 border-text text-text hover:bg-surface hover:border-text text-sm font-medium transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text flex items-center justify-center gap-2"
                                aria-label={isExpanded ? 'Ocultar reproductor' : 'Reproducir'}
                                aria-expanded={isExpanded}
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-4 h-4" />
                                    <span>Ocultar</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4" />
                                    <span>Reproducir</span>
                                  </>
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(song.id)}
                              className="p-2 rounded-xl hover:bg-[rgba(0,0,0,0.05)] transition-colors focus:outline-none focus:ring-2 focus:ring-text"
                              aria-label="Eliminar canción"
                            >
                              <X className="w-4 h-4 text-text-muted hover:text-danger" />
                            </button>
                          </div>
                        </div>

                        {/* Embedded Player (Accordion) */}
                        <AnimatePresence>
                          {isExpanded && embedUrl && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-border">
                                <div className="rounded-b-xl overflow-hidden bg-surface">
                                  <iframe
                                    src={embedUrl}
                                    width="100%"
                                    height="352"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                    title={`Reproductor de ${song.title} por ${song.artist}`}
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {storage.songs.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      )}
      </div>

      {/* Add Song Modal */}
      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        storage={storage}
      />
    </>
  );
}

