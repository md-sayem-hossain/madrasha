import React, { useState } from 'react';
import {
  Bell,
  Pin,
  AlertCircle,
  Calendar,
  User,
  FileText,
  Download,
  Filter,
  Search,
  ArrowRight
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations } from '../../i18n/translations';

export const NoticesView: React.FC = () => {
  const { data, language, setSelectedNotice } = useMadrasa();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const t = translations[language];

  const filteredNotices = data.notices.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = getLocalized(item.title, language).toLowerCase();
      const desc = getLocalized(item.description, language).toLowerCase();
      return title.includes(q) || desc.includes(q);
    }
    return true;
  });

  return (
    <div id="notices-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 islamic-pattern border-b-4 border-amber-500 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
            {t.sec_notices_title}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            নোটিশ বোর্ড ও জরুরি প্রশাসনিক ঘোষণা
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-200/90 leading-relaxed">
            মাদ্রাসার ভর্তি বিজ্ঞপ্তি, পরীক্ষার সময়সূচি, ফলাফল, ছুটির নোটিশ ও গুরুত্বপূর্ণ তথ্যাদি।
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { key: 'all', label: 'সকল নোটিশ' },
            { key: 'admission', label: 'ভর্তি' },
            { key: 'exam', label: 'পরীক্ষা' },
            { key: 'urgent', label: 'জরুরি' },
            { key: 'holiday', label: 'ছুটি' },
            { key: 'general', label: 'সাধারণ' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="নোটিশ খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-600 font-medium"
          />
        </div>
      </div>

      {/* Notices Table / List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20 text-emerald-800" />
            <p className="text-sm font-semibold">কোনো নোটিশ পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredNotices.map(notice => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {notice.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      <Pin className="w-3 h-3" />
                      {t.notice_pinned_badge}
                    </span>
                  )}
                  {notice.category === 'urgent' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-300">
                      <AlertCircle className="w-3 h-3" />
                      {t.notice_urgent_badge}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded font-mono">
                    {notice.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {notice.date}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {getLocalized(notice.title, language)}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {getLocalized(notice.description, language)}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 flex-shrink-0">
                {notice.attachmentName && (
                  <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1 font-medium">
                    <FileText className="w-3 h-3" />
                    <span>সংযুক্তি আছে</span>
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-700 group-hover:text-amber-600 flex items-center gap-1">
                  <span>বিস্তারিত</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
