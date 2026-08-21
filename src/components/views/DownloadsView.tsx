import React, { useState } from 'react';
import { FileText, Download, Calendar, CheckCircle2, Shield, ArrowRight, Check } from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations, formatDate, formatDigits } from '../../lib/translations';

export const DownloadsView: React.FC = () => {
  const { data, language } = useMadrasa();
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const t = translations[language];

  const handleDownload = (item: any) => {
    setDownloadedId(item.id);
    setTimeout(() => {
      setDownloadedId(null);
    }, 3000);
  };

  return (
    <div id="downloads-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 islamic-pattern border-b-4 border-amber-500 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
            {t.sec_downloads_title}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            ডাউনলোড কর্নার ও প্রয়োজনীয় ফরম
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-200/90 leading-relaxed">
            মাদ্রাসার ভর্তি ফরম, নিয়মাবলী, একাডেমিক প্রসপেক্টাস, সিলেবাস ও লিল্লাহ অনুদানের অফিসিয়াল ডকুমেন্টস ডাউনলোড করুন।
          </p>
        </div>
      </div>

      {/* Downloads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.downloads.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono">
                    {item.fileType}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {formatDigits(item.fileSize, language)}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                  {getLocalized(item.title, language)}
                </h3>
                {item.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {getLocalized(item.description, language)}
                  </p>
                )}
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 pt-1">
                  <Calendar className="w-3 h-3" />
                  <span>আপলোড: {formatDate(item.uploadDate, language)}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">অফিসিয়াল কপি</span>
              <button
                onClick={() => handleDownload(item)}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow flex items-center gap-1.5 transition-all ${
                  downloadedId === item.id ? 'bg-emerald-600' : 'bg-emerald-800 hover:bg-emerald-700'
                }`}
              >
                {downloadedId === item.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ডাউনলোড সম্পন্ন</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{t.btn_download}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions on Form Submission */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-700" />
          <span>ভর্তি ফরম পূরণ ও জমা দেওয়ার নির্দেশনা</span>
        </h3>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
          <li>ভর্তি ফরমটি প্রিন্ট করে নীল বা কালো কালির কলম দিয়ে স্পষ্ট অক্ষরে পূরণ করুন।</li>
          <li>শিক্ষার্থীর ২ কপি পাসপোর্ট সাইজ ছবি এবং জন্ম সনদের ফটোকপি সংযুক্ত করুন।</li>
          <li>অভিভাবকের জাতীয় পরিচয়পত্রের ফটোকপি সহ মাদ্রাসার প্রশাসনিক কার্যালয়ে সরাসরি জমা দিন।</li>
        </ul>
      </div>
    </div>
  );
};
