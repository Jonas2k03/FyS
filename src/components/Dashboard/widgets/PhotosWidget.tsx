import { useState } from 'react';
import { Plus, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStorage } from '../../../hooks/useDashboardStorage';
import type { Photo } from '../../../hooks/useDashboardStorage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../ui/carousel';
import { Card, CardContent } from '../../ui/card';

interface PhotosWidgetProps {
  storage: ReturnType<typeof useDashboardStorage>;
}

export function PhotosWidget({ storage }: PhotosWidgetProps) {
  const [fullscreenPhoto, setFullscreenPhoto] = useState<Photo | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const photo: Photo = {
          id: Date.now().toString() + Math.random(),
          src,
          alt: file.name,
        };
        storage.savePhotos([...storage.photos, photo]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (id: string) => {
    storage.savePhotos(storage.photos.filter((photo) => photo.id !== id));
  };

  const handleViewFullscreen = (photo: Photo) => {
    setFullscreenPhoto(photo);
  };

  if (storage.photos.length === 0) {
    return (
      <div className="bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] rounded-2xl border border-border shadow-[0_8px_20px_rgba(0,0,0,0.40)] p-6 md:p-7">
        <h3 className="text-lg font-semibold text-text mb-4">Fotos</h3>
        <label className="block">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            aria-label="Agregar fotos"
          />
          <div className="border-2 border-dashed border-text rounded-lg p-8 text-center cursor-pointer hover:border-text transition-colors bg-surface">
            <Plus className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="text-text">Carga tus primeras fotos</p>
            <p className="text-text-muted text-sm mt-1">Haz clic o arrastra imágenes aquí</p>
          </div>
        </label>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] rounded-2xl border border-border shadow-[0_8px_20px_rgba(0,0,0,0.40)] p-6 md:p-7">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text">Fotos</h3>
          <label className="block">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Agregar más fotos"
            />
            <button
              className="px-3 py-1.5 rounded-xl bg-surface border-2 border-text hover:bg-surface hover:border-text text-text text-sm transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-text"
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>('input[type="file"]');
                input?.click();
              }}
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Agregar
            </button>
          </label>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: storage.photos.length > 3,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {storage.photos.map((photo) => (
              <CarouselItem key={photo.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden group relative">
                    <CardContent className="p-0">
                      <div className="aspect-[4/3] bg-bg overflow-hidden relative">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => handleViewFullscreen(photo)}
                            className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Ver en grande"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(photo.id)}
                            className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Eliminar foto"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {storage.photos.length > 3 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreenPhoto && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFullscreenPhoto(null)}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            >
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={fullscreenPhoto.src}
                alt={fullscreenPhoto.alt}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setFullscreenPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

