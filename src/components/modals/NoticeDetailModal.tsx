import React from 'react';
import { X, Calendar, User, FileText, Download, AlertCircle, Pin } from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations } from '../../i18n/translations';

export const NoticeDetailModal: React.FC = () => {
  const { selectedNotice, setSelectedNotice, language } = useMadrasa();
  const t = translations[language];

  if (!selectedNotice) return null;

  return (
    <div id="notice-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {selectedNotice.isPinned && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  <Pin className="w-3 h-3" />
                  {t.notice_pinned_badge}
                </span>
              )}
              {selectedNotice.category === 'urgent' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-300">
                  <AlertCircle className="w-3 h-3" />
                  {t.notice_urgent_badge}
                </span>
              )}
              <span className="text-[11px] font-semibold text-slate-500 uppercase bg-slate-200/80 px-2 py-0.5 rounded font-mono">
                {selectedNotice.category}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {getLocalized(selectedNotice.title, language)}
            </h3>
          </div>
          <button
            onClick={() => setSelectedNotice(null)}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.notice_published_date} {selectedNotice.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.notice_published_by} {getLocalized(selectedNotice.publishedBy, language)}</span>
            </div>
          </div>

          {/* Body */}
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            {getLocalized(selectedNotice.description, language)}
          </div>

          {/* Attachment Box */}
          {selectedNotice.attachmentName && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-emerald-700" />
                <div>
                  <div className="text-xs font-bold text-emerald-950">
                    {selectedNotice.attachmentName}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono">{t.modal_notice_pdf_desc}</div>
                </div>
              </div>
              <button
                onClick={() => {}}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.btn_download}</span>
              </button>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setSelectedNotice(null)}
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
