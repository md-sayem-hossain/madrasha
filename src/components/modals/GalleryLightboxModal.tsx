import React from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations } from '../../lib/translations';

export const GalleryLightboxModal: React.FC = () => {
  const { galleryLightboxIndex, setGalleryLightboxIndex, data, language } = useMadrasa();
  const t = translations[language];

  if (galleryLightboxIndex === null || !data.gallery[galleryLightboxIndex]) return null;

  const currentItem = data.gallery[galleryLightboxIndex];
  const total = data.gallery.length;

  const nextImage = () => {
    setGalleryLightboxIndex((galleryLightboxIndex + 1) % total);
  };

  const prevImage = () => {
    setGalleryLightboxIndex((galleryLightboxIndex - 1 + total) % total);
  };

  return (
    <div id="gallery-lightbox-backdrop" className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Close button */}
      <button
        onClick={() => setGalleryLightboxIndex(null)}
        className="absolute top-4 right-4 z-10 p-2 text-slate-300 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev / Next controls */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-slate-300 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors hidden sm:flex items-center justify-center"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-slate-300 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors hidden sm:flex items-center justify-center"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image Container */}
      <div className="max-w-4xl w-full flex flex-col items-center">
        <div className="relative max-h-[72vh] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 shadow-2xl">
          <img
            src={currentItem.imageUrl}
            alt={getLocalized(currentItem.title, language)}
            className="max-h-[72vh] max-w-full object-contain rounded-xl"
          />
        </div>

        {/* Caption Bar */}
        <div className="mt-4 w-full bg-slate-900/90 p-4 rounded-xl text-white border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <h4 className="font-bold text-sm text-amber-300">
              {getLocalized(currentItem.title, language)}
            </h4>
            {currentItem.description && (
              <p className="text-slate-300 mt-0.5">
                {getLocalized(currentItem.description, language)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px] flex-shrink-0">
            <span className="bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded capitalize">
              {currentItem.category}
            </span>
            <span>{currentItem.date}</span>
            <span>({galleryLightboxIndex + 1} / {total})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
