import { useState, useEffect } from 'react';
import { Music, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStorage } from '../../../hooks/useDashboardStorage';
import type { Song } from '../../../hooks/useDashboardStorage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../../ui/carousel';
import { AddSongModal } from './AddSongModal';

interface MusicWidgetCompactProps {
  storage: ReturnType<typeof useDashboardStorage>;
}

export function MusicWidgetCompact({ storage }: MusicWidgetCompactProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const cardClass = "bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] rounded-2xl border border-border shadow-[0_8px_20px_rgba(0,0,0,0.40)] h-full flex flex-col p-6 md:p-7";

  // Función para obtener URL de embed
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

  // Actualizar canción actual cuando cambia el slide
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrent(selectedIndex);
      if (storage.songs[selectedIndex]) {
        setCurrentSong(storage.songs[selectedIndex]);
      }
    };

    api.on('select', onSelect);
    onSelect(); // Llamar inmediatamente para establecer el estado inicial

    return () => {
      api.off('select', onSelect);
    };
  }, [api, storage.songs]);

  // Reinicializar carrusel cuando cambian las canciones
  useEffect(() => {
    if (api && storage.songs.length > 0) {
      api.reInit();
    }
  }, [api, storage.songs.length]);

  // Establecer canción inicial
  useEffect(() => {
    if (storage.songs.length > 0 && !currentSong) {
      setCurrentSong(storage.songs[0]);
      setCurrent(0);
    }
  }, [storage.songs, currentSong]);

  const embedUrl = currentSong ? getEmbedUrl(currentSong.url) : null;

  return (
    <div className={cardClass}>
      <div className="flex items-center gap-3 mb-4">
        <Music className="w-6 h-6 text-primary flex-shrink-0" />
        <h3 className="text-lg font-semibold text-text">Nuestra música</h3>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        {storage.songs.length === 0 ? (
          <p className="text-text-muted text-sm flex-1 flex items-center">
            Agrega tu primera canción
          </p>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center mb-3 relative">
              <Carousel 
                setApi={setApi} 
                className="w-full"
                opts={{ loop: storage.songs.length > 1 }}
              >
                <CarouselContent className="px-8 md:px-12">
                  {storage.songs.map((song) => (
                    <CarouselItem key={song.id}>
                      <div className="space-y-2">
                        <p className="text-text font-medium text-base">{song.title}</p>
                        <p className="text-text-muted text-sm">{song.artist}</p>
                        {song.note && (
                          <p className="text-text-muted text-xs mt-2 line-clamp-2">{song.note}</p>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {storage.songs.length > 1 && (
                  <>
                    <CarouselPrevious className="h-7 w-7 left-1 md:-left-4" />
                    <CarouselNext className="h-7 w-7 right-1 md:-right-4" />
                  </>
                )}
              </Carousel>
            </div>

            {/* Reproductor embebido */}
            {embedUrl && currentSong && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSong.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3"
                >
                  <div className="rounded-xl overflow-hidden bg-surface border border-border">
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      title={`Reproductor de ${currentSong.title} por ${currentSong.artist}`}
                      className="w-full"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full px-4 py-2.5 rounded-xl bg-surface border-2 border-text text-text hover:bg-surface hover:border-text text-sm font-medium transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text focus:ring-offset-2 focus:ring-offset-surface"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Agregar
          </button>
        </div>
      </div>

      {/* Add Song Modal */}
      <AddSongModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        storage={storage}
      />
    </div>
  );
}

