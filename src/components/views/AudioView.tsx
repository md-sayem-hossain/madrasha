import React, { useState } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Download,
  Filter,
  Music,
  User,
  Clock,
  Sparkles
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations } from '../../lib/translations';

export const AudioView: React.FC = () => {
  const { data, language, currentTrack, isPlayingAudio, playTrack, togglePlayAudio } = useMadrasa();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = translations[language];

  const filteredAudio = data.audio.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div id="audio-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 islamic-pattern border-b-4 border-amber-500 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
            {t.sec_audio_title}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            অডিও তিলাওয়াত, ওয়াজ ও ইসলামী বয়ান
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-200/90 leading-relaxed">
            আন্তর্জাতিক খ্যাতিসম্পন্ন ক্বারীগণের হৃদয়স্পর্শী কুরআন তিলাওয়াত এবং প্রখ্যাত ওলামায়ে কেরামের দ্বীনি নসিহত অনলাইনে শুনুন ও ডাউনলোড করুন।
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1 text-xs text-slate-500 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>বিভাগ:</span>
        </div>
        {[
          { key: 'all', label: 'সকল অডিও' },
          { key: 'quran', label: 'কুরআন তিলাওয়াত' },
          { key: 'waz', label: 'ওয়াজ ও নসিহত' },
          { key: 'nasheed', label: 'হামদ ও নাত' }
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

      {/* Audio List Cards */}
      <div className="space-y-3">
        {filteredAudio.map(track => {
          const isCurrentActive = currentTrack?.id === track.id;
          const isCurrentlyPlaying = isCurrentActive && isPlayingAudio;

          return (
            <div
              key={track.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isCurrentActive
                  ? 'bg-emerald-50/80 border-emerald-400 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (isCurrentActive) {
                      togglePlayAudio();
                    } else {
                      playTrack(track);
                    }
                  }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform shadow ${
                    isCurrentlyPlaying
                      ? 'bg-amber-500 text-emerald-950 scale-105 animate-pulse'
                      : 'bg-emerald-900 text-amber-300 hover:bg-emerald-800'
                  }`}
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                      {track.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {track.duration}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1">
                    {getLocalized(track.title, language)}
                  </h3>
                  <p className="text-xs text-emerald-700 font-medium">
                    {t.audio_speaker} {getLocalized(track.speaker, language)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <button
                  onClick={() => {
                    if (isCurrentActive) {
                      togglePlayAudio();
                    } else {
                      playTrack(track);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  {isCurrentlyPlaying ? 'বিরতি (Pause)' : 'শুনুন (Play)'}
                </button>
                <a
                  href={track.audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="অডিও ফাইল ডাউনলোড"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
