import React from 'react';
import { X, MapPin, Mail, Phone, Calendar, HeartHandshake, Award } from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations, formatDigits } from '../../lib/translations';

export const FounderDetailModal: React.FC = () => {
  const { selectedFounder, setSelectedFounder, language } = useMadrasa();
  const t = translations[language];

  if (!selectedFounder) return null;

  return (
    <div id="founder-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-950 to-emerald-900 text-white p-6 pb-12">
          <button
            onClick={() => setSelectedFounder(null)}
            className="absolute top-4 right-4 p-1.5 text-emerald-300 hover:text-white rounded-full bg-emerald-900/60 hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="inline-block text-[11px] font-semibold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20 mb-2">
            {t.sec_founders_title}
          </span>
          <h3 className="text-xl font-bold text-white">
            {getLocalized(selectedFounder.name, language)}
          </h3>
          <p className="text-sm text-amber-300">
            {getLocalized(selectedFounder.designation, language)}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 pt-0 relative -mt-8">
          <div className="flex items-end gap-4 mb-5">
            <img
              src={selectedFounder.image}
              alt={getLocalized(selectedFounder.name, language)}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-emerald-100 flex-shrink-0"
            />
            <div className="pb-1">
              <div className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded inline-flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>{t.modal_founder_since} {formatDigits(selectedFounder.founderSince, language)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            {/* About / Slogan */}
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/60">
              <p className="text-xs text-amber-950 font-medium leading-relaxed italic">
                "{getLocalized(selectedFounder.about, language)}"
              </p>
            </div>

            {/* Contribution */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wide mb-1">
                <HeartHandshake className="w-4 h-4 text-emerald-700" />
                <span>{t.modal_founder_contribution}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {getLocalized(selectedFounder.historyContribution, language)}
              </p>
            </div>

            {/* Biography */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
                {t.modal_founder_bio}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {getLocalized(selectedFounder.biography, language)}
              </p>
            </div>

            {/* Background */}
            {selectedFounder.educationalBackground && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.modal_founder_edu_prof}</span>
                </div>
                <p className="text-xs text-slate-600">
                  {getLocalized(selectedFounder.educationalBackground, language)}
                  {selectedFounder.professionalBackground && ` • ${getLocalized(selectedFounder.professionalBackground, language)}`}
                </p>
              </div>
            )}

            {/* Contact / Address */}
            <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{getLocalized(selectedFounder.address, language)}</span>
              </div>
              {selectedFounder.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <a href={`tel:${selectedFounder.phone}`} className="hover:text-emerald-800 font-mono">
                    {formatDigits(selectedFounder.phone, language)}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setSelectedFounder(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
            >
              {t.btn_close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
