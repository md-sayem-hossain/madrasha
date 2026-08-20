import React from 'react';
import { X, Mail, Phone, MapPin, Award, BookOpen, Clock, Calendar } from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations } from '../../i18n/translations';

export const TeacherDetailModal: React.FC = () => {
  const { selectedTeacher, setSelectedTeacher, language } = useMadrasa();
  const t = translations[language];

  if (!selectedTeacher) return null;

  return (
    <div id="teacher-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="relative bg-emerald-950 text-white p-6 pb-12">
          <button
            onClick={() => setSelectedTeacher(null)}
            className="absolute top-4 right-4 p-1.5 text-emerald-300 hover:text-white rounded-full bg-emerald-900/60 hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="inline-block text-[11px] font-semibold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20 mb-2">
            {getLocalized(selectedTeacher.department, language)}
          </span>
          <h3 className="text-xl font-bold text-white">
            {getLocalized(selectedTeacher.name, language)}
          </h3>
          <p className="text-sm text-emerald-300">
            {getLocalized(selectedTeacher.designation, language)}
          </p>
        </div>

        {/* Profile Details Content */}
        <div className="p-6 pt-0 relative -mt-8">
          <div className="flex items-end gap-4 mb-5">
            <img
              src={selectedTeacher.image}
              alt={getLocalized(selectedTeacher.name, language)}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-emerald-100 flex-shrink-0"
            />
            <div className="pb-1">
              <div className="text-xs font-semibold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded inline-flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>{getLocalized(selectedTeacher.subject, language)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-700">
            {/* Qualification */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wide mb-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{t.modal_qualifications}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {getLocalized(selectedTeacher.qualifications, language)}
              </p>
            </div>

            {/* Experience */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.modal_experience}</span>
                </div>
                <div className="font-bold text-slate-800">
                  {getLocalized(selectedTeacher.experience, language)}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.modal_joining_year}</span>
                </div>
                <div className="font-bold text-slate-800">
                  {selectedTeacher.joiningDate}
                </div>
              </div>
            </div>

            {/* Biography */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1.5">
                {t.modal_bio_intro}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {getLocalized(selectedTeacher.biography, language)}
              </p>
            </div>

            {/* Contact Info */}
            <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{getLocalized(selectedTeacher.address, language)}</span>
              </div>
              {selectedTeacher.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <a href={`tel:${selectedTeacher.phone}`} className="hover:text-emerald-800 font-mono font-medium">
                    {selectedTeacher.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setSelectedTeacher(null)}
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
