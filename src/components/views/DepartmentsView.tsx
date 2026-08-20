import React from 'react';
import {
  BookOpen,
  HeartHandshake,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Phone,
  FileText
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations } from '../../i18n/translations';

export const DepartmentsView: React.FC = () => {
  const { data, language, setActiveTab } = useMadrasa();
  const t = translations[language];

  return (
    <div id="departments-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 islamic-pattern border-b-4 border-amber-500 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
            {t.sec_departments_title}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            শিক্ষা বিভাগ ও প্রাতিষ্ঠানিক কার্যক্রম
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-200/90 leading-relaxed">
            শৈশবকালীন নূরানী কায়দা থেকে শুরু করে পূর্ণাঙ্গ হিফজুল কুরআন, আরবি সাহিত্য ও আদর্শ সমাজ বিনির্মাণের উপযোগী বহুমুখী পাঠ্যক্রম।
          </p>
        </div>
      </div>

      {/* Departments Detail Cards */}
      <div className="space-y-8">
        {data.departments.map((dep, index) => (
          <div
            key={dep.id}
            className={`bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                  কোর্স মেয়াদ: {getLocalized(dep.duration, language)}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {getLocalized(dep.name, language)}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {getLocalized(dep.description, language)}
              </p>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  বিভাগীয় প্রধান বৈশিষ্ট্যসমূহ:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dep.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{getLocalized(feat, language)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('downloads')}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>ভর্তি ফরম ডাউনলোড</span>
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                >
                  পরামর্শ ও তথ্য জানতে যোগাযোগ
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white aspect-[4/3] bg-emerald-950">
                <img
                  src={dep.image}
                  alt={getLocalized(dep.name, language)}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admission Callout Box */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold text-amber-300">ভর্তি সংক্রান্ত যেকোনো তথ্য</h3>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
            মাদ্রাসার হিফজ ও নূরানী শাখায় আবাসিক/অনাবাসিক ভর্তি ফি, মাসিক বেতন এবং এতিমখানার সুযোগ-সুবিধা জানতে আমাদের হেল্পলাইনে ফোন করুন।
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${data.settings.phone}`}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            <span>{data.settings.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
