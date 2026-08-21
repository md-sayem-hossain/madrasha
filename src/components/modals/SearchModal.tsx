import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  User,
  Users,
  Bell,
  Calendar,
  Music,
  Video,
  FileText,
  ArrowRight
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { getLocalized, translations } from '../../lib/translations';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    language,
    data,
    setActiveTab,
    setSelectedTeacher,
    setSelectedFounder,
    setSelectedNotice,
    setSelectedVideo,
    playTrack
  } = useMadrasa();

  const [query, setQuery] = useState('');
  const t = translations[language];

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const teachers = data.teachers.filter(
      item =>
        getLocalized(item.name, language).toLowerCase().includes(q) ||
        getLocalized(item.designation, language).toLowerCase().includes(q) ||
        getLocalized(item.subject, language).toLowerCase().includes(q)
    );

    const founders = data.founders.filter(
      item =>
        getLocalized(item.name, language).toLowerCase().includes(q) ||
        getLocalized(item.about, language).toLowerCase().includes(q) ||
        getLocalized(item.biography, language).toLowerCase().includes(q)
    );

    const notices = data.notices.filter(
      item =>
        getLocalized(item.title, language).toLowerCase().includes(q) ||
        getLocalized(item.description, language).toLowerCase().includes(q)
    );

    const events = data.events.filter(
      item =>
        getLocalized(item.title, language).toLowerCase().includes(q) ||
        getLocalized(item.description, language).toLowerCase().includes(q) ||
        getLocalized(item.location, language).toLowerCase().includes(q)
    );

    const audios = data.audio.filter(
      item =>
        getLocalized(item.title, language).toLowerCase().includes(q) ||
        getLocalized(item.speaker, language).toLowerCase().includes(q)
    );

    const videos = data.videos.filter(
      item =>
        getLocalized(item.title, language).toLowerCase().includes(q) ||
        getLocalized(item.presenter, language).toLowerCase().includes(q)
    );

    const downloads = data.downloads.filter(
      item =>
        getLocalized(item.title, language).toLowerCase().includes(q)
    );

    return {
      teachers,
      founders,
      notices,
      events,
      audios,
      videos,
      downloads,
      total:
        teachers.length +
        founders.length +
        notices.length +
        events.length +
        audios.length +
        videos.length +
        downloads.length
    };
  }, [query, data, language]);

  if (!isSearchOpen) return null;

  const handleClose = () => {
    setIsSearchOpen(false);
    setQuery('');
  };

  return (
    <div id="search-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <input
            id="global-search-input"
            type="text"
            placeholder={t.nav_search}
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-sm sm:text-base outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5">
              {t.search_clear}
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[65vh] overflow-y-auto space-y-5">
          {!query.trim() ? (
            <div className="text-center py-10 text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-800" />
              <p className="text-sm">{t.search_heading}</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                <span className="text-slate-500">{t.search_examples_label}</span>
                {['হিফজ', 'ভর্তি', 'ডাঃ আহমেদ', 'মুফতি', 'মাহফিল', 'নূরানী'].map(k => (
                  <button
                    key={k}
                    onClick={() => setQuery(k)}
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-emerald-800 hover:border-emerald-200 border border-slate-200"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          ) : results && results.total === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm font-semibold">"{query}" {t.search_no_results}</p>
              <p className="text-xs text-slate-400 mt-1">{t.search_try_different}</p>
            </div>
          ) : (
            results && (
              <>
                {/* Teachers */}
                {results.teachers.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{t.nav_teachers} ({results.teachers.length})</span>
                    </h4>
                    <div className="space-y-1.5">
                      {results.teachers.map(teacher => (
                        <div
                          key={teacher.id}
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            handleClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-emerald-50 cursor-pointer border border-slate-100 hover:border-emerald-200 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={teacher.image}
                              alt={getLocalized(teacher.name, language)}
                              className="w-9 h-9 rounded-full object-cover border border-emerald-600/30"
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {getLocalized(teacher.name, language)}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {getLocalized(teacher.designation, language)} • {getLocalized(teacher.subject, language)}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-emerald-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Founders */}
                {results.founders.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{t.nav_founders} ({results.founders.length})</span>
                    </h4>
                    <div className="space-y-1.5">
                      {results.founders.map(founder => (
                        <div
                          key={founder.id}
                          onClick={() => {
                            setSelectedFounder(founder);
                            handleClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-50 cursor-pointer border border-slate-100 hover:border-amber-200 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={founder.image}
                              alt={getLocalized(founder.name, language)}
                              className="w-9 h-9 rounded-full object-cover border border-amber-600/30"
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {getLocalized(founder.name, language)}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {getLocalized(founder.designation, language)}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-amber-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notices */}
                {results.notices.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5" />
                      <span>{t.nav_notices} ({results.notices.length})</span>
                    </h4>
                    <div className="space-y-1.5">
                      {results.notices.map(notice => (
                        <div
                          key={notice.id}
                          onClick={() => {
                            setSelectedNotice(notice);
                            handleClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-blue-50 cursor-pointer border border-slate-100 hover:border-blue-200 transition-colors"
                        >
                          <div>
                            <div className="text-xs font-semibold text-slate-900">
                              {getLocalized(notice.title, language)}
                            </div>
                            <div className="text-[10px] text-slate-400">{notice.date}</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-blue-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audio */}
                {results.audios.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5" />
                      <span>{t.nav_audio} ({results.audios.length})</span>
                    </h4>
                    <div className="space-y-1.5">
                      {results.audios.map(audio => (
                        <div
                          key={audio.id}
                          onClick={() => {
                            playTrack(audio);
                            handleClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-purple-50 cursor-pointer border border-slate-100 hover:border-purple-200 transition-colors"
                        >
                          <div>
                            <div className="text-xs font-semibold text-slate-900">
                              {getLocalized(audio.title, language)}
                            </div>
                            <div className="text-[11px] text-purple-700">
                              {getLocalized(audio.speaker, language)} • {audio.duration}
                            </div>
                          </div>
                          <span className="text-xs text-purple-600 font-bold">{t.btn_play_audio}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {results.videos.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5" />
                      <span>{t.nav_video} ({results.videos.length})</span>
                    </h4>
                    <div className="space-y-1.5">
                      {results.videos.map(video => (
                        <div
                          key={video.id}
                          onClick={() => {
                            setSelectedVideo(video);
                            handleClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-red-50 cursor-pointer border border-slate-100 hover:border-red-200 transition-colors"
                        >
                          <div>
                            <div className="text-xs font-semibold text-slate-900">
                              {getLocalized(video.title, language)}
                            </div>
                            <div className="text-[11px] text-red-700">
                              {getLocalized(video.presenter, language)}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-red-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Downloads */}
                {results.downloads.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t.nav_downloads} ({results.downloads.length})</span>
                    </h4>
                    <div className="space-y-1.5">
                      {results.downloads.map(dl => (
                        <div
                          key={dl.id}
                          onClick={() => {
                            setActiveTab('downloads');
                            handleClose();
                          }}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-emerald-50 cursor-pointer border border-slate-100 hover:border-emerald-200 transition-colors"
                        >
                          <div className="text-xs font-medium text-slate-800">
                            {getLocalized(dl.title, language)} ({dl.fileSize})
                          </div>
                          <span className="text-xs text-emerald-700 font-bold">{t.btn_download}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};
