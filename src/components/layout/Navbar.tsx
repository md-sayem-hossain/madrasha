import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  Globe,
  Search,
  LogIn,
  User,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Clock,
  Volume2,
  Shield,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  Music,
  Video,
  Image as ImageIcon,
  Bell,
  Calendar,
  FileText,
  Building2
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { translations, getLocalized } from '../../i18n/translations';
import { Language } from '../../types';

interface NavDropdownItem {
  key: string;
  label: string;
  desc?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  type: 'link' | 'dropdown';
  key?: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: NavDropdownItem[];
}

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    currentUser,
    data,
    setIsSearchOpen,
    isPlayingAudio,
    currentTrack,
    togglePlayAudio
  } = useMadrasa();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(null);
  const [openMobileAccordions, setOpenMobileAccordions] = useState<Record<string, boolean>>({
    about: true,
    media: false,
    activities: false
  });

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = translations[language];

  // Structured Nav Groups with Dropdowns
  const navStructure: NavGroup[] = [
    {
      type: 'link',
      key: 'home',
      label: t.nav_home
    },
    {
      type: 'dropdown',
      label: language === 'bn' ? 'পরিচিতি ও প্রশাসন' : language === 'ar' ? 'عن المؤسسة' : 'About & Administration',
      key: 'about_group',
      items: [
        {
          key: 'about',
          label: t.nav_about,
          desc: language === 'bn' ? 'মাদ্রাসার ইতিহাস, লক্ষ্য ও মাইলফলক' : 'History, Mission & Milestones',
          icon: BookOpen
        },
        {
          key: 'founders',
          label: t.nav_founders,
          desc: language === 'bn' ? 'প্রতিষ্ঠাতা ও আজীবন পৃষ্ঠপোষকবৃন্দ' : 'Founders & Lifetime Donors',
          icon: Users
        },
        {
          key: 'teachers',
          label: t.nav_teachers,
          desc: language === 'bn' ? 'সম্মানিত উস্তাদ ও শিক্ষকমণ্ডলী' : 'Respected Faculty & Teachers',
          icon: GraduationCap
        },
        {
          key: 'departments',
          label: t.nav_departments,
          desc: language === 'bn' ? 'হিফজ, কিতাব ও অন্যান্য বিভাগসমূহ' : 'Academic Departments & Syllabi',
          icon: Building2
        }
      ]
    },
    {
      type: 'dropdown',
      label: language === 'bn' ? 'মিডিয়া ও গ্যালারি' : language === 'ar' ? 'الإعلام والمعرض' : 'Media & Gallery',
      key: 'media_group',
      items: [
        {
          key: 'audio',
          label: t.nav_audio,
          desc: language === 'bn' ? 'কুরআন তিলাওয়াত, হামদ-নাত ও বয়ান' : 'Quran Tilawat, Nasheed & Waz',
          icon: Music
        },
        {
          key: 'video',
          label: t.nav_video,
          desc: language === 'bn' ? 'ভিডিও ওয়াজ ও প্রাতিষ্ঠানিক ডকুমেন্টারি' : 'Video Lectures & Documentaries',
          icon: Video
        },
        {
          key: 'gallery',
          label: t.nav_gallery,
          desc: language === 'bn' ? 'ক্যাম্পাস, অনুষ্ঠান ও স্মৃতি অ্যালবাম' : 'Campus, Programs & Event Photos',
          icon: ImageIcon
        }
      ]
    },
    {
      type: 'dropdown',
      label: language === 'bn' ? 'বিজ্ঞপ্তি ও কার্যক্রম' : language === 'ar' ? 'الإعلانات والأنشطة' : 'Notices & Events',
      key: 'activities_group',
      items: [
        {
          key: 'notices',
          label: t.nav_notices,
          desc: language === 'bn' ? 'ভর্তি, পরীক্ষা ও সাধারণ নোটিশ' : 'Admission, Exam & General Notices',
          icon: Bell
        },
        {
          key: 'events',
          label: t.nav_events,
          desc: language === 'bn' ? 'বার্ষিক মাহফিল, দস্তারবন্দি ও সেমিনার' : 'Annual Mahfils & Seminars',
          icon: Calendar
        }
      ]
    },
    {
      type: 'link',
      key: 'downloads',
      label: t.nav_downloads
    },
    {
      type: 'link',
      key: 'contact',
      label: t.nav_contact
    }
  ];

  const handleNavClick = (key: string) => {
    setActiveTab(key);
    setMobileMenuOpen(false);
    setOpenDesktopDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  const handleMouseEnter = (groupKey: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDesktopDropdown(groupKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDesktopDropdown(null);
    }, 200);
  };

  const toggleMobileAccordion = (groupKey: string) => {
    setOpenMobileAccordions(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Check if any sub-item in a group is active
  const isGroupActive = (group: NavGroup) => {
    if (group.type === 'link') {
      return activeTab === group.key;
    }
    return group.items?.some(item => item.key === activeTab);
  };

  return (
    <header id="site-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0a4d28]/10 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-[#1a2e1a] text-emerald-100 text-xs py-1.5 px-4 sm:px-6 border-b border-[#0a4d28]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Emergency Ticker or Address snippet */}
          <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1 font-semibold text-[#d4af37] bg-[#d4af37]/15 px-2.5 py-0.5 rounded text-[11px] border border-[#d4af37]/30">
              <Clock className="w-3 h-3" />
              {t.top_established}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-100/90">
              <MapPin className="w-3 h-3 text-[#d4af37]" />
              {getLocalized(data.settings.address, language)}
            </span>
            {data.settings.emergencyNotice?.enabled && (
              <span className="inline-flex items-center gap-1.5 text-[#d4af37] font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
                {getLocalized(data.settings.emergencyNotice.text, language)}
              </span>
            )}
          </div>

          {/* Quick Contact & Language */}
          <div className="flex items-center gap-3 ml-auto">
            <a
              href={`tel:${data.settings.phone}`}
              className="hidden md:inline-flex items-center gap-1 hover:text-[#d4af37] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#d4af37]" />
              <span>{data.settings.phone}</span>
            </a>
            <a
              href={`mailto:${data.settings.email}`}
              className="hidden lg:inline-flex items-center gap-1 hover:text-[#d4af37] transition-colors"
            >
              <Mail className="w-3 h-3 text-[#d4af37]" />
              <span>{data.settings.email}</span>
            </a>

            {/* Language Switcher */}
            <div className="relative">
              <button
                id="language-switcher-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 bg-[#0a4d28] hover:bg-[#083e20] text-white px-2.5 py-1 rounded text-xs font-medium transition-colors border border-[#d4af37]/40 shadow-sm"
                aria-label="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>
                  {language === 'bn' ? 'বাংলা' : language === 'ar' ? 'العربية' : 'English'}
                </span>
                <ChevronDown className="w-3 h-3 text-emerald-200" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 py-1 z-50 text-xs">
                  <button
                    onClick={() => handleLangChange('bn')}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-emerald-50 ${
                      language === 'bn' ? 'text-[#0a4d28] font-bold bg-emerald-50/60' : ''
                    }`}
                  >
                    <span>বাংলা (Bangla)</span>
                    {language === 'bn' && <span className="w-1.5 h-1.5 rounded-full bg-[#0a4d28]"></span>}
                  </button>
                  <button
                    onClick={() => handleLangChange('en')}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-emerald-50 ${
                      language === 'en' ? 'text-[#0a4d28] font-bold bg-emerald-50/60' : ''
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-[#0a4d28]"></span>}
                  </button>
                  <button
                    onClick={() => handleLangChange('ar')}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-emerald-50 ${
                      language === 'ar' ? 'text-[#0a4d28] font-bold bg-emerald-50/60' : ''
                    }`}
                  >
                    <span>العربية (Arabic)</span>
                    {language === 'ar' && <span className="w-1.5 h-1.5 rounded-full bg-[#0a4d28]"></span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand & Top Action Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          {/* Logo & Madrasa Title */}
          <div
            id="brand-logo-container"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Islamic Floral Emblem Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0a4d28] to-[#1a2e1a] text-[#d4af37] flex items-center justify-center shadow-md border-2 border-[#d4af37] group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="text-center font-bold">
                <span className="block text-[9px] uppercase tracking-tighter text-[#d4af37]">الجديد</span>
                <span className="block text-xl font-serif leading-none text-[#d4af37]">م</span>
              </div>
            </div>

            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-[#0a4d28] leading-tight group-hover:text-[#06381c] transition-colors">
                {getLocalized(data.settings.name, language)}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {getLocalized(data.settings.slogan, language)}
              </p>
            </div>
          </div>

          {/* Action Buttons: Search, Audio Mini, Portal Login */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Audio shortcut if playing */}
            {currentTrack && (
              <button
                id="audio-ticker-btn"
                onClick={togglePlayAudio}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#0a4d28] text-xs font-medium hover:bg-emerald-100 transition-colors"
                title="Audio Player"
              >
                <Volume2 className={`w-4 h-4 text-[#0a4d28] ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span className="max-w-[140px] truncate">{getLocalized(currentTrack.title, language)}</span>
                {isPlayingAudio && (
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-0.5 bg-[#0a4d28] animate-wave-1"></span>
                    <span className="w-0.5 bg-[#0a4d28] animate-wave-2"></span>
                    <span className="w-0.5 bg-[#0a4d28] animate-wave-3"></span>
                  </span>
                )}
              </button>
            )}

            {/* Universal Search trigger */}
            <button
              id="search-trigger-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Portal Login / Dashboard Button */}
            <button
              id="portal-toggle-btn"
              onClick={() => handleNavClick('portal')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                activeTab === 'portal'
                  ? 'bg-[#d4af37] text-[#0a4d28] font-bold shadow-md'
                  : currentUser
                  ? 'bg-[#0a4d28] text-white hover:bg-[#083e20] shadow-sm'
                  : 'bg-gradient-to-r from-[#0a4d28] to-[#1a2e1a] text-[#d4af37] hover:text-white border border-[#d4af37]/50'
              }`}
            >
              {currentUser ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>
                    {currentUser.role === 'super_admin'
                      ? 'সুপার ড্যাশবোর্ড'
                      : currentUser.role === 'founder'
                      ? 'প্রতিষ্ঠাতা পোর্টাল'
                      : 'অ্যাডমিন প্যানেল'}
                  </span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.nav_portal}</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile menu and search buttons */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <button
              id="mobile-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#0a4d28] text-white hover:bg-[#083e20]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links Bar with Dropdowns */}
        <nav id="desktop-nav" className="hidden lg:flex items-center justify-between border-t border-slate-200/80 py-1">
          <div className="flex items-center gap-1 text-sm font-medium">
            {navStructure.map(group => {
              const groupActive = isGroupActive(group);

              if (group.type === 'link') {
                return (
                  <button
                    key={group.key}
                    id={`nav-item-${group.key}`}
                    onClick={() => handleNavClick(group.key!)}
                    className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap text-[13.5px] ${
                      groupActive
                        ? 'text-[#0a4d28] font-bold bg-emerald-50/80 border-b-2 border-[#0a4d28]'
                        : 'text-slate-700 hover:text-[#0a4d28] hover:bg-slate-100/70'
                    }`}
                  >
                    {group.label}
                  </button>
                );
              }

              // Dropdown Menu Item
              const isDropdownOpen = openDesktopDropdown === group.key;

              return (
                <div
                  key={group.key}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(group.key!)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    id={`nav-dropdown-btn-${group.key}`}
                    onClick={() => setOpenDesktopDropdown(isDropdownOpen ? null : group.key!)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors whitespace-nowrap text-[13.5px] ${
                      groupActive || isDropdownOpen
                        ? 'text-[#0a4d28] font-bold bg-emerald-50/80 border-b-2 border-[#0a4d28]'
                        : 'text-slate-700 hover:text-[#0a4d28] hover:bg-slate-100/70'
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#0a4d28]' : 'text-slate-400'}`} />
                  </button>

                  {/* Dropdown Floating Panel */}
                  {isDropdownOpen && (
                    <div
                      id={`nav-dropdown-panel-${group.key}`}
                      className="absolute left-0 top-full mt-1 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                        {group.label}
                      </div>

                      {group.items?.map(item => {
                        const Icon = item.icon;
                        const isItemActive = activeTab === item.key;
                        return (
                          <button
                            key={item.key}
                            id={`nav-subitem-${item.key}`}
                            onClick={() => handleNavClick(item.key)}
                            className={`w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors ${
                              isItemActive
                                ? 'bg-emerald-50/90 text-[#0a4d28] font-semibold border-l-4 border-[#0a4d28]'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-[#0a4d28]'
                            }`}
                          >
                            <div className={`p-2 rounded-lg flex-shrink-0 mt-0.5 ${
                              isItemActive ? 'bg-[#0a4d28] text-[#d4af37]' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold leading-tight flex items-center justify-between">
                                <span>{item.label}</span>
                                {isItemActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0a4d28]"></span>}
                              </div>
                              {item.desc && (
                                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                  {item.desc}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center pl-2">
            <button
              id="quick-admission-nav-btn"
              onClick={() => handleNavClick('downloads')}
              className="px-3.5 py-1.5 rounded-md bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#0a4d28] text-xs font-bold border border-[#d4af37]/50 whitespace-nowrap transition-colors"
            >
              {t.btn_admission_form}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Navigation with Accordions */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-1.5 pb-3">
            {navStructure.map(group => {
              if (group.type === 'link') {
                const isActive = activeTab === group.key;
                return (
                  <button
                    key={group.key}
                    id={`mobile-nav-${group.key}`}
                    onClick={() => handleNavClick(group.key!)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-[#0a4d28] text-white font-semibold shadow-sm'
                        : 'text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span>{group.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>}
                  </button>
                );
              }

              // Accordion Group for Mobile
              const isAccordionOpen = openMobileAccordions[group.key!];
              const groupActive = isGroupActive(group);

              return (
                <div key={group.key} className="rounded-xl border border-slate-150 overflow-hidden bg-slate-50/50">
                  <button
                    id={`mobile-accordion-${group.key}`}
                    onClick={() => toggleMobileAccordion(group.key!)}
                    className={`w-full text-left px-3.5 py-2.5 text-sm font-semibold flex items-center justify-between ${
                      groupActive ? 'text-[#0a4d28] bg-emerald-50/70' : 'text-slate-800'
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAccordionOpen ? 'rotate-180 text-[#0a4d28]' : 'text-slate-400'}`} />
                  </button>

                  {isAccordionOpen && (
                    <div className="bg-white border-t border-slate-200/70 px-2 py-1.5 space-y-1">
                      {group.items?.map(item => {
                        const Icon = item.icon;
                        const isItemActive = activeTab === item.key;
                        return (
                          <button
                            key={item.key}
                            id={`mobile-subnav-${item.key}`}
                            onClick={() => handleNavClick(item.key)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                              isItemActive
                                ? 'bg-emerald-100/70 text-[#0a4d28] font-bold'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isItemActive ? 'text-[#0a4d28]' : 'text-slate-400'}`} />
                            <div className="flex-1">
                              <div>{item.label}</div>
                            </div>
                            {isItemActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0a4d28]"></span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <button
              id="mobile-portal-btn"
              onClick={() => handleNavClick('portal')}
              className={`w-full text-left mt-2 px-3.5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 shadow-sm ${
                activeTab === 'portal'
                  ? 'bg-[#d4af37] text-[#0a4d28] font-bold'
                  : 'bg-[#0a4d28] text-white hover:bg-[#083e20]'
              }`}
            >
              <Shield className="w-4 h-4 text-[#d4af37]" />
              <span>
                {currentUser ? `${currentUser.name} (${currentUser.role.replace('_', ' ')})` : t.nav_portal}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

