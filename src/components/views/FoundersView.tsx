import React from 'react';
import { Users, HeartHandshake, Award, Calendar, MapPin, Phone, Mail, ArrowRight, Shield } from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations } from '../../i18n/translations';

export const FoundersView: React.FC = () => {
  const { data, language, setSelectedFounder, setActiveTab } = useMadrasa();
  const t = translations[language];

  return (
    <div id="founders-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 islamic-pattern border-b-4 border-amber-500 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
            {t.sec_founders_title}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            সম্মানিত প্রতিষ্ঠাতাবৃন্দ ও আজীবন পৃষ্ঠপোষক
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-200/90 leading-relaxed">
            যাঁদের নিঃস্বার্থ দান, জমিদান, সার্বিক দিকনির্দেশনা ও ত্যাগের বিনিময়ে গড়ে উঠেছে ডাঃ আহমেদ উল্ল্যা-ছালেহা আল-জাদিদ মাদ্রাসা।
          </p>
        </div>
      </div>

      {/* Founders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.founders.map(founder => (
          <div
            key={founder.id}
            onClick={() => setSelectedFounder(founder)}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Image & Header Frame */}
              <div className="h-56 relative overflow-hidden bg-emerald-950">
                <img
                  src={founder.image}
                  alt={getLocalized(founder.name, language)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent flex items-end p-4">
                  <span className="text-[11px] font-bold text-amber-300 bg-emerald-900/80 px-2.5 py-1 rounded-full border border-amber-400/30 backdrop-blur-sm">
                    প্রতিষ্ঠাতা সন: {founder.founderSince}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {getLocalized(founder.name, language)}
                  </h3>
                  <p className="text-xs font-semibold text-amber-700 mt-0.5">
                    {getLocalized(founder.designation, language)}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic bg-amber-50/50 p-3 rounded-xl border border-amber-100/60 line-clamp-2">
                  "{getLocalized(founder.about, language)}"
                </p>

                <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                  <div className="flex items-start gap-2">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{getLocalized(founder.historyContribution, language)}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{getLocalized(founder.address, language)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-6 pt-0">
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:text-amber-600">
                <span>সম্পূর্ণ জীবনী ও অবদান পড়ুন</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Founder Portal Note */}
      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-800 text-amber-300">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950">প্রতিষ্ঠাতা তথ্য হালনাগাদ ও পোর্টাল</h4>
            <p className="text-xs text-emerald-700">প্রতিষ্ঠাতা মহোদয়গণ তাদের তথ্য ও জীবনী আপডেট করার জন্য পোর্টাল ব্যবহার করতে পারেন।</p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('portal')}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow"
        >
          প্রতিষ্ঠাতা লগইন
        </button>
      </div>
    </div>
  );
};
