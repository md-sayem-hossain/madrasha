import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations } from '../../lib/translations';

export const TeachersView: React.FC = () => {
  const { data, language, setSelectedTeacher } = useMadrasa();
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const t = translations[language];

  const filteredTeachers = data.teachers.filter(teacher => {
    if (!teacher.isActive) return false;
    if (selectedDept === 'all') return true;
    return getLocalized(teacher.department, 'bn').includes(selectedDept);
  });

  return (
    <div id="teachers-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Top Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 islamic-pattern border-b-4 border-amber-500 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
            {t.sec_teachers_title}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            অভিজ্ঞ শিক্ষকমণ্ডলী ও সুযোগ্য ওলামায়ে কেরাম
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-200/90 leading-relaxed">
            কুরআনুল কারীমের সহিহ হিফজ, হাদিস ও আধুনিক আরবি সাহিত্য শিক্ষাদানে নিবেদিতপ্রাণ শিক্ষকবৃন্দ।
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1 text-xs text-slate-500 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>বিভাগ নির্বাচন:</span>
        </div>
        {[
          { key: 'all', label: 'সকল শিক্ষক' },
          { key: 'হিফজ', label: 'হিফজুল কুরআন' },
          { key: 'নূরানী', label: 'নূরানী ও প্রাথমিক' },
          { key: 'কিতাব', label: 'কিতাব ও আরবি' },
          { key: 'প্রশাসন', label: 'প্রশাসন ও ইফতা' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedDept(cat.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedDept === cat.key
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTeachers.map(teacher => (
          <div
            key={teacher.id}
            onClick={() => setSelectedTeacher(teacher)}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div className="h-52 relative overflow-hidden bg-emerald-950">
                <img
                  src={teacher.image}
                  alt={getLocalized(teacher.name, language)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    {getLocalized(teacher.department, language)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-800 line-clamp-1">
                  {getLocalized(teacher.name, language)}
                </h3>
                <p className="text-xs text-amber-700 font-semibold line-clamp-1">
                  {getLocalized(teacher.designation, language)}
                </p>

                <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-900 font-medium">
                    <BookOpen className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                    <span className="truncate">{getLocalized(teacher.subject, language)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                    <span>অভিজ্ঞতা: {getLocalized(teacher.experience, language)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>প্রোফাইল বিবরণ</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
