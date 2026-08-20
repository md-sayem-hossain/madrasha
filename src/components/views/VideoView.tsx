import React, { useState } from 'react';
import { Video, Play, Filter, User, Calendar, Clock } from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations } from '../../i18n/translations';

export const VideoView: React.FC = () => {
  const { data, language, setSelectedVideo } = useMadrasa();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = translations[language];

  const filteredVideos = data.videos.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div id="video-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 islamic-pattern border-b-4 border-amber-500 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
            ভিডিও গ্যালারি
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            ভিডিও বয়ান, ডকুমেন্টারি ও মাহফিল
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-200/90 leading-relaxed">
            মাদ্রাসার বার্ষিক ইসলামী মহাসম্মেলন, বিশেষ ওয়াজ মাহফিল ও ছাত্রদের কোরআন প্রতিযোগিতার ভিডিও ফুটেজ।
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1 text-xs text-slate-500 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>ক্যাটাগরি:</span>
        </div>
        {[
          { key: 'all', label: 'সকল ভিডিও' },
          { key: 'waz', label: 'ওয়াজ ও আলোচনা' },
          { key: 'documentary', label: 'ডকুমেন্টারি' },
          { key: 'event', label: 'প্রতিযোগিতা ও অনুষ্ঠান' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === cat.key
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail with play overlay */}
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={video.thumbnailUrl}
                  alt={getLocalized(video.title, language)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-emerald-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-sm">
                  {video.duration}
                </div>
                <div className="absolute bottom-2 left-2 bg-emerald-900/80 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                  {video.category}
                </div>
              </div>

              {/* Title & Presenter */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-800 line-clamp-2">
                  {getLocalized(video.title, language)}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium">
                  <User className="w-3.5 h-3.5" />
                  <span>{getLocalized(video.presenter, language)}</span>
                </div>
                {video.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {getLocalized(video.description, language)}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {video.date}
              </span>
              <span className="text-emerald-700 font-bold group-hover:text-amber-600">
                ভিডিও দেখুন
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
