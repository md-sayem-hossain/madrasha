import React, { useState } from 'react';
import { Image, Filter, Eye, Calendar, Sparkles } from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations } from '../../lib/translations';

export const GalleryView: React.FC = () => {
  const { data, language, setGalleryLightboxIndex } = useMadrasa();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = translations[language];

  const filteredItems = data.gallery.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div id="gallery-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 islamic-pattern border-b-4 border-amber-500 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
            {t.sec_gallery_title}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            ফটো গ্যালারি ও চিত্রশালা
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-200/90 leading-relaxed">
            মাদ্রাসার ক্যাম্পাস, শ্রেণিকক্ষ, ইসলামী প্রতিযোগিতা, মাহফিল এবং ঐতিহাসিক মুহূর্তসমূহের স্থিরচিত্র।
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1 text-xs text-slate-500 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>ক্যাটাগরি:</span>
        </div>
        {[
          { key: 'all', label: 'সকল ছবি' },
          { key: 'campus', label: 'ক্যাম্পাস ও পরিবেশ' },
          { key: 'classes', label: 'হিফজ ও ক্লাস' },
          { key: 'events', label: 'মাহফিল ও সম্মেলন' },
          { key: 'awards', label: 'পুরস্কার বিতরণ' }
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setGalleryLightboxIndex(idx)}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 shadow-sm border border-slate-200 cursor-pointer hover:shadow-xl transition-all"
          >
            <img
              src={item.imageUrl}
              alt={getLocalized(item.title, language)}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between text-white">
              <div className="flex justify-end">
                <span className="p-2 rounded-full bg-amber-500 text-emerald-950 shadow">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-emerald-900/90 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <h3 className="font-bold text-sm text-white mt-1">
                  {getLocalized(item.title, language)}
                </h3>
                {item.description && (
                  <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                    {getLocalized(item.description, language)}
                  </p>
                )}
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
