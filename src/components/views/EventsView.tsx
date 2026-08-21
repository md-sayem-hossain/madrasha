import React, { useState } from 'react';
import { Calendar, MapPin, Clock, User, Award, CheckCircle2, Filter } from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations, formatDate, formatTime } from '../../lib/translations';

export const EventsView: React.FC = () => {
  const { data, language } = useMadrasa();
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past'>('all');
  const t = translations[language];

  const filteredEvents = data.events.filter(event => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'upcoming') return event.isUpcoming;
    if (filterStatus === 'past') return !event.isUpcoming;
    return true;
  });

  return (
    <div id="events-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 islamic-pattern border-b-4 border-amber-500 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
            {t.sec_events_title}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
            অনুষ্ঠানমালা, বার্ষিক সম্মেলন ও মাহফিল
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-200/90 leading-relaxed">
            মাদ্রাসার বার্ষিক ইসলামী মহাসম্মেলন, কৃতি ছাত্র সংবর্ধনা, হিফজ সমাপনী পাগড়ি প্রদান ও দোয়ার মাহফিলের সময়সূচি।
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1 text-xs text-slate-500 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>ফিল্টার:</span>
        </div>
        {[
          { key: 'all', label: 'সকল অনুষ্ঠান' },
          { key: 'upcoming', label: 'আসন্ন অনুষ্ঠান' },
          { key: 'past', label: 'বিগত মাহফিল' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setFilterStatus(cat.key as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === cat.key
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredEvents.map(event => (
          <div
            key={event.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Event Image */}
              <div className="h-52 relative overflow-hidden bg-emerald-950">
                <img
                  src={event.image}
                  alt={getLocalized(event.title, language)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-amber-500 text-emerald-950 font-bold text-xs px-3 py-1 rounded-full shadow font-mono">
                  {formatDate(event.date, language)}
                </div>
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow ${
                      event.isUpcoming
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {event.isUpcoming ? 'আসন্ন অনুষ্ঠান' : 'সম্পন্ন'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                  {getLocalized(event.title, language)}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {getLocalized(event.description, language)}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>সময়: {formatTime(event.time, language)}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span>স্থান: {getLocalized(event.location, language)}</span>
                  </div>
                  {event.guestSpeakers && event.guestSpeakers.length > 0 && (
                    <div className="text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 font-medium space-y-1">
                      {event.guestSpeakers.map((sp, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <User className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                          <span>{getLocalized(sp, language)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs font-semibold text-emerald-900">
                সকল ধর্মপ্রাণ মুসলমান ভাইদের দলে দলে উপস্থিত হওয়ার বিনীত অনুরোধ রইল।
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
