import React from 'react';
import { X, Calendar, User, Video } from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations } from '../../i18n/translations';

export const VideoPlayerModal: React.FC = () => {
  const { selectedVideo, setSelectedVideo, language } = useMadrasa();
  const t = translations[language];

  if (!selectedVideo) return null;

  return (
    <div id="video-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-white">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold truncate max-w-md sm:max-w-xl">
              {getLocalized(selectedVideo.title, language)}
            </h3>
          </div>
          <button
            onClick={() => setSelectedVideo(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Embed Frame */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={selectedVideo.videoUrl}
            title={getLocalized(selectedVideo.title, language)}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Description & Presenter */}
        <div className="p-4 sm:p-5 bg-slate-900 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-amber-400 font-medium">
              <User className="w-3.5 h-3.5" />
              <span>{t.modal_video_presenter} {getLocalized(selectedVideo.presenter, language)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{selectedVideo.date}</span>
            </div>
          </div>
          {selectedVideo.description && (
            <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
              {getLocalized(selectedVideo.description, language)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
