import React from 'react';
import {
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Compass,
  HeartHandshake
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations, formatDigits } from '../../lib/translations';

export const AboutHistoryView: React.FC = () => {
  const { data, language, setActiveTab } = useMadrasa();
  const t = translations[language];

  return (
    <div id="about-history-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 islamic-pattern border-b-4 border-amber-500 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
            {t.sec_history_subtitle}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            {getLocalized(data.history.mainTitle, language)}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-200/90 leading-relaxed">
            {getLocalized(data.settings.name, language)} এর শুভ সূচনা, লক্ষ্য-উদ্দেশ্য এবং ঐতিহাসিক পথচলার পূর্ণাঙ্গ বিবরণ।
          </p>
        </div>
      </div>

      {/* Purpose & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            প্রতিষ্ঠার পটভূমি ও মূল উদ্দেশ্য
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {getLocalized(data.history.purposeOfEstablishment, language)}
          </p>
          <div className="pt-2 text-xs text-slate-500 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <strong className="text-emerald-900 font-bold block mb-1">আমাদের ভিশন:</strong>
            সন্দ্বীপের প্রত্যন্ত অঞ্চলের প্রতিটি ঘরে কুরআন ও সহিহ সুন্নাহর আলো পৌঁছে দেওয়া এবং নৈতিক ও আধুনিক জ্ঞানসম্পন্ন যোগ্য দাঈ ও আলেম গড়ে তোলা।
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            সূচনার পেছনের গল্প
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {getLocalized(data.history.backgroundStory, language)}
          </p>
          <div className="pt-2 text-xs text-slate-500 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
            <strong className="text-amber-900 font-bold block mb-1">লিল্লাহ ফান্ড ও এতিম সেবা:</strong>
            প্রতিষ্ঠার প্রথম দিন থেকেই যেকোনো এতিম ও দুস্থ শিক্ষার্থীর সম্পূর্ণ ব্যয়ভার প্রতিষ্ঠানের নিজস্ব তহবিল ও পৃষ্ঠপোষকদের মাধ্যমে নির্বাহ করা হচ্ছে।
          </div>
        </div>
      </div>

      {/* Major Achievements */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" />
          <span>আমাদের প্রধান অর্জনসমূহ</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.history.majorAchievements.map((ach, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                {getLocalized(ach, language)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Milestones Timeline */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            মাইলফলক ও অগ্রগতি
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            প্রতিষ্ঠা থেকে বর্তমান পর্যন্ত ঐতিহাসিক পরিক্রমা
          </h2>
        </div>

        <div className="relative border-l-2 border-emerald-800/30 ml-4 sm:ml-32 space-y-10 py-4">
          {data.history.milestones.map((item, index) => (
            <div key={item.id} className="relative pl-6 sm:pl-8 group">
              {/* Year marker on left (desktop) */}
              <div className="hidden sm:block absolute -left-28 top-0.5 text-right w-24">
                <span className="text-base font-extrabold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono">
                  {formatDigits(item.year, language)}
                </span>
              </div>

              {/* Dot */}
              <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow group-hover:scale-125 transition-transform" />

              {/* Content card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 shadow-sm group-hover:border-emerald-300 transition-colors">
                <span className="sm:hidden inline-block text-xs font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded mb-2 font-mono">
                  সন: {formatDigits(item.year, language)}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-emerald-800">
                  {getLocalized(item.title, language)}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {getLocalized(item.description, language)}
                </p>
                {item.image && (
                  <div className="mt-4 rounded-xl overflow-hidden max-h-56 aspect-video bg-slate-200">
                    <img
                      src={item.image}
                      alt={getLocalized(item.title, language)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
