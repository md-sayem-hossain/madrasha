import React from 'react';
import {
  BookOpen,
  GraduationCap,
  HeartHandshake,
  Users,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  Play,
  Volume2,
  Bell,
  FileText,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations, formatDigits, formatDate } from '../../lib/translations';

export const HomeView: React.FC = () => {
  const {
    language,
    data,
    setActiveTab,
    playTrack,
    setSelectedTeacher,
    setSelectedFounder,
    setSelectedNotice,
    setSelectedVideo,
    setGalleryLightboxIndex
  } = useMadrasa();

  const t = translations[language];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enabledSections = (data.settings.homepageSections || [])
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  const isSectionEnabled = (key: string) => {
    const sec = (data.settings.homepageSections || []).find(s => s.key === key);
    return sec ? sec.enabled : true;
  };

  return (
    <div id="home-view" className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero / Banner Section */}
      {isSectionEnabled('hero') && (
        <section id="hero-section" className="relative overflow-hidden bg-[#0a4d28] text-white islamic-pattern border-b-4 border-[#d4af37]">
          {/* Subtle Islamic Arc Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1a] via-[#0a4d28]/85 to-transparent pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-28 text-center flex flex-col items-center">
            {/* Bismillah Calligraphy */}
            <div className="inline-block mb-4 px-5 py-1.5 rounded-full bg-[#1a2e1a]/80 border border-[#d4af37]/40 text-[#d4af37] font-serif text-sm sm:text-base tracking-widest shadow-md notranslate" translate="no">
              {t.hero_bismillah}
            </div>

            {/* Madrasa Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl leading-tight drop-shadow-sm">
              {getLocalized(data.settings.name, language)}
            </h1>

            {/* Sub-slogan */}
            <p className="mt-4 text-sm sm:text-lg md:text-xl text-emerald-100/95 max-w-2xl font-normal leading-relaxed">
              {getLocalized(data.settings.slogan, language)}
            </p>

            {/* Location Pill */}
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1a2e1a]/70 border border-[#d4af37]/40 text-xs text-[#d4af37] font-medium shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{getLocalized(data.settings.district, language)}, {getLocalized(data.settings.upazila, language)} (স্থাপিত: {formatDigits(data.settings.establishedYear, language)} খ্রি.)</span>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                id="hero-admission-cta"
                onClick={() => handleTabChange('downloads')}
                className="px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#c49f27] text-[#0a4d28] font-bold text-sm shadow-xl shadow-[#d4af37]/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>{t.hero_cta_admission}</span>
              </button>

              <button
                id="hero-history-cta"
                onClick={() => handleTabChange('about')}
                className="px-6 py-3 rounded-xl bg-[#1a2e1a] hover:bg-[#152515] text-white font-semibold text-sm border border-[#d4af37]/50 shadow-lg transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#d4af37]" />
                <span>{t.hero_cta_history}</span>
              </button>

              <button
                id="hero-contact-cta"
                onClick={() => handleTabChange('contact')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 font-medium text-sm backdrop-blur-sm border border-white/25 transition-colors"
              >
                {t.nav_contact}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. Verse / Hadith of the Day Banner */}
      {isSectionEnabled('quote') && (
        <section id="daily-quote-section" className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-[#1a2e1a] via-[#0a4d28] to-[#1a2e1a] rounded-2xl p-6 sm:p-8 text-white shadow-md border border-[#d4af37]/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#d4af37]/20 text-[#d4af37] flex-shrink-0 border border-[#d4af37]/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#d4af37]">
                  হাদিস শরীফ (Prophetic Guidance)
                </span>
                <p className="text-base sm:text-lg font-medium text-white mt-1 italic leading-relaxed">
                  "তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সে, যে নিজে কুরআন শিখে এবং অন্যকে শিক্ষা দেয়।"
                </p>
                <p className="text-xs text-emerald-200 mt-1 font-mono">
                  — সহিহ বুখারী, হাদিস নং: ৫০২৭
                </p>
              </div>
            </div>

            <button
              onClick={() => handleTabChange('audio')}
              className="px-4 py-2.5 rounded-lg bg-[#d4af37] hover:bg-[#c49f27] text-[#0a4d28] text-xs font-bold whitespace-nowrap shadow transition-all flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>কুরআন তিলাওয়াত শুনুন</span>
            </button>
          </div>
        </section>
      )}

      {/* 3. Stats & Quick Metrics */}
      {isSectionEnabled('stats') && (
        <section id="stats-section" className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-2xl border-t-4 border-[#0a4d28] border-x border-b border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-[#0a4d28] flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1b3a1b] font-mono">{formatDigits('350+', language)}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{t.hero_stat_students}</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border-t-4 border-[#d4af37] border-x border-b border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 text-[#d4af37] flex items-center justify-center mb-3">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1b3a1b] font-mono">{formatDigits('200+', language)}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{t.hero_stat_hifz}</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border-t-4 border-[#0a4d28] border-x border-b border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-[#0a4d28] flex items-center justify-center mb-3">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1b3a1b] font-mono">{formatDigits('15+', language)}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{t.hero_stat_teachers}</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border-t-4 border-[#d4af37] border-x border-b border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 text-[#0a4d28] flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1b3a1b] font-mono">{formatDigits('25+', language)}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{t.hero_stat_years}</div>
            </div>
          </div>
        </section>
      )}

      {/* 3.1 Today's Prayer Schedule Section */}
      <section id="home-prayer-schedule-section" className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#1a2e1a] via-[#0a4d28] to-[#152515] rounded-3xl p-6 sm:p-8 text-white shadow-lg border-2 border-[#d4af37]/40">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center lg:text-left">
              <div className="p-3.5 rounded-2xl bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 shadow-inner flex-shrink-0">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                    {t.top_prayer_times}
                  </h3>
                  <span className="text-[10px] font-bold bg-[#d4af37] text-[#0a4d28] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    দৈনিক জামাত
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/90 mt-1">
                  মাদ্রাসার কেন্দ্রীয় মসজিদে পাঁচ ওয়াক্ত জামাত ও জুমুআর নির্ধারিত সময়
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3 w-full lg:w-auto">
              <div className="bg-black/25 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-center">
                <span className="block text-xs font-semibold text-emerald-300 mb-1">{t.top_fajr}</span>
                <span className="block text-sm sm:text-base font-bold text-white font-mono">{formatDigits(data.settings.prayerTimes.fajr, language)}</span>
              </div>
              <div className="bg-black/25 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-center">
                <span className="block text-xs font-semibold text-emerald-300 mb-1">{t.top_dhuhr}</span>
                <span className="block text-sm sm:text-base font-bold text-white font-mono">{formatDigits(data.settings.prayerTimes.dhuhr, language)}</span>
              </div>
              <div className="bg-black/25 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-center">
                <span className="block text-xs font-semibold text-emerald-300 mb-1">{t.top_asr}</span>
                <span className="block text-sm sm:text-base font-bold text-white font-mono">{formatDigits(data.settings.prayerTimes.asr, language)}</span>
              </div>
              <div className="bg-black/25 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-center">
                <span className="block text-xs font-semibold text-emerald-300 mb-1">{t.top_maghrib}</span>
                <span className="block text-sm sm:text-base font-bold text-white font-mono">{formatDigits(data.settings.prayerTimes.maghrib, language)}</span>
              </div>
              <div className="bg-black/25 backdrop-blur-sm p-3 rounded-2xl border border-white/10 text-center">
                <span className="block text-xs font-semibold text-emerald-300 mb-1">{t.top_isha}</span>
                <span className="block text-sm sm:text-base font-bold text-white font-mono">{formatDigits(data.settings.prayerTimes.isha, language)}</span>
              </div>
              <div className="bg-[#d4af37]/25 backdrop-blur-sm p-3 rounded-2xl border border-[#d4af37]/50 text-center">
                <span className="block text-xs font-bold text-[#d4af37] mb-1">{t.top_jummah}</span>
                <span className="block text-sm sm:text-base font-extrabold text-amber-200 font-mono">{formatDigits(data.settings.prayerTimes.jummah, language)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. About & Brief History Highlight */}
      {isSectionEnabled('intro') && (
        <section id="intro-section" className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {t.sec_history_subtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {getLocalized(data.history.mainTitle, language)}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {getLocalized(data.history.introduction, language)}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {data.history.majorAchievements.slice(0, 4).map((ach, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{getLocalized(ach, language)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => handleTabChange('about')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                >
                  <span>{t.btn_read_more}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleTabChange('founders')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                >
                  {t.nav_founders}
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] bg-emerald-950">
                <img
                  src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&auto=format&fit=crop&q=80"
                  alt="Madrasa Building"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white text-xs">
                    <div className="font-bold text-amber-300">মাদ্রাসার মূল ক্যাম্পাস ও জামে মসজিদ</div>
                    <div className="text-[11px] text-slate-300">কুড়িয়ামৌড়া, সন্দ্বীপ, চট্টগ্রাম</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Founders Spotlight */}
      {isSectionEnabled('founders') && (
        <section id="founders-section" className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                {t.sec_founders_title}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {t.sec_founders_subtitle}
              </h2>
            </div>
            <button
              onClick={() => handleTabChange('founders')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>{t.btn_view_all}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.founders.slice(0, 3).map(founder => (
              <div
                key={founder.id}
                onClick={() => setSelectedFounder(founder)}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={founder.image}
                      alt={getLocalized(founder.name, language)}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/40 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-800 transition-colors">
                        {getLocalized(founder.name, language)}
                      </h3>
                      <p className="text-xs text-amber-700 font-semibold mt-0.5">
                        {getLocalized(founder.designation, language)}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        প্রতিষ্ঠাতা সন: {founder.founderSince}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {getLocalized(founder.about, language)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                  <span>পূর্ণ জীবনী ও অবদান</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Academic Departments */}
      {isSectionEnabled('departments') && (
        <section id="departments-section" className="bg-emerald-900/5 py-12 border-y border-emerald-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
                {t.sec_departments_title}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                {t.sec_departments_subtitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.departments.map(dep => (
                <div
                  key={dep.id}
                  onClick={() => handleTabChange('departments')}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col"
                >
                  <div className="h-40 relative overflow-hidden bg-emerald-950">
                    <img
                      src={dep.image}
                      alt={getLocalized(dep.name, language)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-xs font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                        মেয়াদ: {getLocalized(dep.duration, language)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-800 transition-colors mb-2">
                        {getLocalized(dep.name, language)}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                        {getLocalized(dep.description, language)}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                      <span>সিলেবাস ও বিবরণ</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Dual Widget: Notice Board & Upcoming Events */}
      {isSectionEnabled('notices') && (
        <section id="notices-events-section" className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Notices Board */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-red-50 text-red-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                      {t.sec_notices_title}
                    </h3>
                    <p className="text-xs text-slate-500">সাম্প্রতিক বিজ্ঞপ্তি ও প্রাতিষ্ঠানিক ঘোষণা</p>
                  </div>
                </div>
                <button
                  onClick={() => handleTabChange('notices')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                >
                  {t.btn_view_all}
                </button>
              </div>

              <div className="space-y-3">
                {data.notices.slice(0, 3).map(notice => (
                  <div
                    key={notice.id}
                    onClick={() => setSelectedNotice(notice)}
                    className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/70 hover:border-emerald-200 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {notice.isPinned && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            {t.notice_pinned_badge}
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-slate-500 uppercase bg-slate-200 px-1.5 py-0.5 rounded">
                          {notice.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(notice.date, language)}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800 line-clamp-1">
                      {getLocalized(notice.title, language)}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {getLocalized(notice.description, language)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Events Showcase */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                        {t.sec_events_title}
                      </h3>
                      <p className="text-xs text-slate-500">আসন্ন মাহফিল ও ইসলামী সম্মেলন</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTabChange('events')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                  >
                    {t.btn_view_all}
                  </button>
                </div>

                {data.events[0] && (
                  <div
                    onClick={() => handleTabChange('events')}
                    className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer group"
                  >
                    <div className="h-36 relative overflow-hidden bg-emerald-950">
                      <img
                        src={data.events[0].image}
                        alt={getLocalized(data.events[0].title, language)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 right-2 bg-amber-500 text-emerald-950 font-bold text-[11px] px-2 py-0.5 rounded shadow font-mono">
                        {formatDate(data.events[0].date, language)}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-800">
                        {getLocalized(data.events[0].title, language)}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                        <span className="truncate">{getLocalized(data.events[0].location, language)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">পরবর্তী ইভেন্টের তালিকা দেখুন</span>
                <button
                  onClick={() => handleTabChange('events')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                >
                  <span>সকল ইভেন্ট</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. Multimedia Section: Featured Audio & Videos */}
      {isSectionEnabled('media') && (
        <section id="media-section" className="bg-emerald-950 text-white py-14 border-y-2 border-amber-500/50 islamic-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-emerald-900/80 px-2.5 py-0.5 rounded border border-amber-400/20">
                  {t.sec_audio_title}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  {t.sec_audio_subtitle}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTabChange('audio')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-xs font-bold border border-emerald-700 transition-colors"
                >
                  সকল অডিও
                </button>
                <button
                  onClick={() => handleTabChange('video')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-xs font-bold border border-emerald-700 transition-colors"
                >
                  সকল ভিডিও
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Featured Audio List */}
              <div className="bg-emerald-900/60 backdrop-blur-sm rounded-2xl p-5 border border-emerald-800/80 space-y-3">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <span>কুরআন তিলাওয়াত ও বয়ান সংকলন</span>
                </div>
                {data.audio.slice(0, 3).map(item => (
                  <div
                    key={item.id}
                    onClick={() => playTrack(item)}
                    className="p-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-800/70 border border-emerald-800/50 hover:border-amber-400/50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500 text-emerald-950 flex items-center justify-center flex-shrink-0 shadow group-hover:scale-105 transition-transform">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 line-clamp-1">
                          {getLocalized(item.title, language)}
                        </h4>
                        <p className="text-[11px] text-emerald-300">
                          {getLocalized(item.speaker, language)} • {item.duration}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>

              {/* Featured Video Card */}
              {data.videos[0] && (
                <div
                  onClick={() => setSelectedVideo(data.videos[0])}
                  className="bg-emerald-900/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-emerald-800/80 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <img
                      src={data.videos[0].thumbnailUrl}
                      alt={getLocalized(data.videos[0].title, language)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-amber-500/90 text-emerald-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm p-2 rounded text-xs text-white">
                      <div className="font-bold text-amber-300 truncate">
                        {getLocalized(data.videos[0].title, language)}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between text-xs text-emerald-200">
                    <span>বক্তা: {getLocalized(data.videos[0].presenter, language)}</span>
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      ভিডিও প্লে করুন <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 9. Photo Gallery Preview */}
      {isSectionEnabled('gallery') && (
        <section id="gallery-preview-section" className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {t.sec_gallery_title}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {t.sec_gallery_subtitle}
              </h2>
            </div>
            <button
              onClick={() => handleTabChange('gallery')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>{t.btn_view_all}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.gallery.slice(0, 4).map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setGalleryLightboxIndex(idx)}
                className="relative rounded-2xl overflow-hidden aspect-square bg-slate-900 shadow-sm cursor-pointer group border border-slate-200"
              >
                <img
                  src={item.imageUrl}
                  alt={getLocalized(item.title, language)}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white">
                  <div className="text-xs">
                    <div className="font-bold text-amber-300 leading-tight">
                      {getLocalized(item.title, language)}
                    </div>
                    <div className="text-[10px] text-slate-300 uppercase mt-0.5">{item.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. Location & Quick Contact Card */}
      {isSectionEnabled('contact') && (
        <section id="contact-preview-section" className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {t.sec_contact_title}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {getLocalized(data.settings.name, language)}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                ভর্তি, লিল্লাহ বোর্ডিংয়ে অনুদান বা যেকোনো তথ্য ও দিকনির্দেশনার জন্য সরাসরি আমাদের কার্যালয়ে যোগাযোগ করুন অথবা মেসেজ পাঠান।
              </p>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{getLocalized(data.settings.address, language)}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span className="font-bold font-mono">{data.settings.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span className="font-medium">{data.settings.email}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => handleTabChange('contact')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  {t.btn_contact_us}
                </button>
                <a
                  href={`tel:${data.settings.phone}`}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold transition-colors"
                >
                  কল করুন
                </a>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md h-64 bg-slate-100">
              <iframe
                src={data.settings.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sandwip Madrasa Location Map"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
