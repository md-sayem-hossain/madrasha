import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  UserCheck,
  User,
  Users,
  Settings,
  BookOpen,
  Calendar,
  Bell,
  Music,
  Video,
  Image,
  FileText,
  Save,
  LogOut,
  CheckCircle,
  Eye,
  Clock,
  Sparkles,
  Lock,
  Key,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Activity,
  HardDrive,
  Check,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  ShieldAlert,
  Search,
  Globe,
  Layers,
  LayoutDashboard,
  Building2,
  FolderArchive,
  GraduationCap
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { AdminPermission, Language } from '../../types';
import { hasPermission } from '../../lib/security';
import { getLocalized } from '../../lib/translations';

// Sub-components
import { FounderProfileEditor } from './FounderProfileEditor';
import { UserPermissionsManager } from './UserPermissionsManager';
import { EventsManager } from './cms/EventsManager';
import { AudioManager } from './cms/AudioManager';
import { VideoManager } from './cms/VideoManager';
import { GalleryManager } from './cms/GalleryManager';
import { DownloadsManager } from './cms/DownloadsManager';
import { NoticesManager } from './cms/NoticesManager';
import { TeachersManager } from './cms/TeachersManager';
import { FoundersManager } from './cms/FoundersManager';
import { HistoryManager } from './cms/HistoryManager';
import { SettingsManager } from './cms/SettingsManager';
import { ContactsManager } from './cms/ContactsManager';
import { BackupManager } from './cms/BackupManager';
import { ActivityLogsViewer } from './cms/ActivityLogsViewer';

export type AdminSection =
  | 'overview'
  | 'my_profile'
  | 'users'
  | 'settings'
  | 'history'
  | 'founders'
  | 'teachers'
  | 'notices'
  | 'events'
  | 'audio'
  | 'video'
  | 'gallery'
  | 'downloads'
  | 'contacts'
  | 'backup'
  | 'logs';

interface AdminModuleItem {
  id: AdminSection;
  label: string;
  desc?: string;
  icon: React.ComponentType<{ className?: string }>;
  allowed: boolean;
  count: number | null;
  color: string;
}

interface AdminModuleGroup {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: AdminModuleItem[];
}

export const AdminPortal: React.FC = () => {
  const {
    currentUser,
    login,
    logout,
    data,
    saveDataToServer,
    isSaving,
    setActiveTab,
    language,
    setLanguage
  } = useMadrasa();

  // Login form state
  const [loginRole, setLoginRole] = useState<'super_admin' | 'admin' | 'founder'>('super_admin');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Active section
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Accordion open states for mobile and sidebar
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    dashboard_group: true,
    admin_group: true,
    activities_group: true,
    media_group: true,
    system_group: true
  });

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Sync active section when role changes
  useEffect(() => {
    if (currentUser?.role === 'founder') {
      setActiveSection('my_profile');
    } else if (activeSection === 'my_profile') {
      setActiveSection('overview');
    }
  }, [currentUser?.role]);

  // Guard against founder accessing restricted overview section
  useEffect(() => {
    if (currentUser?.role === 'founder' && activeSection === 'overview') {
      setActiveSection('my_profile');
    }
  }, [currentUser?.role, activeSection]);

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isFounder = currentUser?.role === 'founder';

  // Structured Module Navigation Groups like the Main Website
  const moduleGroups: AdminModuleGroup[] = [
    {
      key: 'dashboard_group',
      title: 'সার্বিক নিয়ন্ত্রণ ও ওভারভিউ',
      icon: LayoutDashboard,
      items: [
        {
          id: 'overview',
          label: 'ড্যাশবোর্ড ওভারভিউ',
          desc: 'রিয়েল-টাইম কন্টেন্ট স্ট্যাটাস ও পরিসংখ্যান',
          icon: Sparkles,
          allowed: !isFounder,
          count: null,
          color: 'text-emerald-700'
        },
        {
          id: 'my_profile',
          label: 'আমার প্রতিষ্ঠাতা প্রোফাইল',
          desc: 'নিজস্ব জীবনী, বাণী ও ব্যক্তিগত তথ্য',
          icon: UserCheck,
          allowed: isFounder,
          count: null,
          color: 'text-amber-600'
        }
      ]
    },
    {
      key: 'admin_group',
      title: 'পরিচিতি ও প্রশাসন',
      icon: Building2,
      items: [
        {
          id: 'teachers',
          label: 'শিক্ষকমণ্ডলী তালিকা',
          desc: 'উস্তাদগণের প্রোফাইল, বিষয় ও যোগ্যতা',
          icon: GraduationCap,
          allowed: isSuperAdmin || hasPermission(currentUser, 'manage_teachers'),
          count: data.teachers?.length || 0,
          color: 'text-blue-600'
        },
        {
          id: 'founders',
          label: 'প্রতিষ্ঠাতা পরিচিতি',
          desc: 'আজীবন সদস্য ও প্রতিষ্ঠাতা পরিষদের তালিকা',
          icon: Users,
          allowed: isSuperAdmin || hasPermission(currentUser, 'manage_founders'),
          count: data.founders?.length || 0,
          color: 'text-amber-700'
        },
        {
          id: 'history',
          label: 'ইতিহাস ও ঐতিহ্য',
          desc: 'মাদ্রাসার ইতিহাস ও ঐতিহাসিক মাইলফলক',
          icon: BookOpen,
          allowed: isSuperAdmin || hasPermission(currentUser, 'manage_history'),
          count: data.history?.milestones?.length || 0,
          color: 'text-teal-700'
        }
      ]
    },
    {
      key: 'activities_group',
      title: 'বিজ্ঞপ্তি ও কার্যক্রম',
      icon: Bell,
      items: [
        {
          id: 'notices',
          label: 'নোটিশ বোর্ড',
          desc: 'ভর্তি, পরীক্ষা ও জরুরি নোটিশ প্রকাশ',
          icon: Bell,
          allowed: isSuperAdmin || hasPermission(currentUser, 'manage_notices'),
          count: data.notices?.length || 0,
          color: 'text-amber-600'
        },
        {
          id: 'events',
          label: 'ইভেন্ট ও মাহফিল',
          desc: 'বার্ষিক মাহফিল, দস্তারবন্দি ও সেমিনার',
          icon: Calendar,
          allowed: isSuperAdmin || hasPermission(currentUser, 'manage_events'),
          count: data.events?.length || 0,
          color: 'text-emerald-600'
        },
        {
          id: 'downloads',
          label: 'ডাউনলোড ও ফরম',
          desc: 'ভর্তি ফরম, প্রসপেক্টাস ও সিলেবাস ফাইল',
          icon: FileText,
          allowed: isSuperAdmin || hasPermission(currentUser, 'manage_downloads'),
          count: data.downloads?.length || 0,
          color: 'text-indigo-600'
        },
        {
          id: 'contacts',
          label: 'বার্তা ইনবক্স',
          desc: 'ওয়েবসাইট ভিজিটরদের পাঠানো যোগাযোগ বার্তা',
          icon: MessageSquare,
          allowed: isSuperAdmin || hasPermission(currentUser, 'manage_contacts'),
          count: data.contacts?.length || 0,
          color: 'text-sky-600'
        }
      ]
    },
    {
      key: 'media_group',
      title: 'মিডিয়া ও গ্যালারি',
      icon: Music,
      items: [
        {
          id: 'audio',
          label: 'অডিও তিলাওয়াত',
          desc: 'কুরআন তিলাওয়াত ও হামদ-নাত অ্যালবাম',
          icon: Music,
          allowed: isSuperAdmin || hasPermission(currentUser, 'manage_audio'),
          count: data.audio?.length || 0,
          color: 'text-purple-600'
        },
        {
          id: 'video',
          label: 'ভিডিও ও বয়ান',
          desc: 'ভিডিও লেকচার ও প্রাতিষ্ঠানিক প্রামাণ্যচিত্র',
          icon: Video,
          allowed: isSuperAdmin || hasPermission(currentUser, 'manage_video'),
          count: data.videos?.length || 0,
          color: 'text-red-600'
        },
        {
          id: 'gallery',
          label: 'ফটো গ্যালারি',
          desc: 'ক্যাম্পাস, অনুষ্ঠান ও স্মরণীয় স্মৃতি অ্যালবাম',
          icon: Image,
          allowed: isSuperAdmin || hasPermission(currentUser, 'manage_gallery'),
          count: data.gallery?.length || 0,
          color: 'text-teal-600'
        }
      ]
    },
    {
      key: 'system_group',
      title: 'সিস্টেম ও সিকিউরিটি',
      icon: Shield,
      items: [
        {
          id: 'users',
          label: 'ইউজার ও পারমিশন',
          desc: 'অ্যাডমিন অ্যাকাউন্ট ও মডিউল পারমিশন রুল',
          icon: ShieldCheck,
          allowed: isSuperAdmin || hasPermission(currentUser, 'manage_users'),
          count: data.users?.length || 0,
          color: 'text-emerald-800'
        },
        {
          id: 'settings',
          label: 'প্রাতিষ্ঠানিক সেটিংস',
          desc: 'নাম, ঠিকানা, ফোন ও নামাজের সময়সূচি',
          icon: Settings,
          allowed: isSuperAdmin || hasPermission(currentUser, 'manage_settings'),
          count: null,
          color: 'text-slate-600'
        },
        {
          id: 'backup',
          label: 'ব্যাকআপ ও রিস্টোর',
          desc: 'সম্পূর্ণ সিস্টেম ডেটা এক্সপোর্ট ও রিস্টোর',
          icon: HardDrive,
          allowed: isSuperAdmin,
          count: null,
          color: 'text-emerald-700'
        },
        {
          id: 'logs',
          label: 'সিকিউরিটি অডিট লগ',
          desc: 'অ্যাডমিন কর্মকাণ্ডের স্বয়ংক্রিয় অডিট হিস্টোরি',
          icon: Activity,
          allowed: isSuperAdmin || hasPermission(currentUser, 'manage_settings'),
          count: data.activityLogs?.length || 0,
          color: 'text-slate-700'
        }
      ]
    }
  ];

  // Flattened list for quick lookups
  const allNavItems = moduleGroups.flatMap(g => g.items);
  const activeItemInfo = allNavItems.find(i => i.id === activeSection);

  // If not logged in, show Login Screen with Fixed Navbar & responsive styling
  if (!currentUser) {
    return (
      <div id="admin-portal-login-root" className="min-h-screen bg-slate-100 flex flex-col">
        {/* Fixed Header for Login Screen */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0a4d28]/10 shadow-xs">
          <div className="bg-[#1a2e1a] text-emerald-100 text-xs py-1.5 px-4 sm:px-6 border-b border-[#0a4d28]">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-[#d4af37]">
                ডাঃ আহমেদ উল্ল্যা-ছালেহা আল-জাদিদ মাদ্রাসা
              </span>
              <button
                onClick={() => setActiveTab('home')}
                className="text-[11px] font-medium text-emerald-200 hover:text-white transition-colors cursor-pointer"
              >
                ← মূল ওয়েবসাইটে ফিরে যান
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a4d28] to-[#1a2e1a] text-[#d4af37] flex items-center justify-center shadow-md border-2 border-[#d4af37] flex-shrink-0" translate="no">
                <div className="text-center font-bold" translate="no">
                  <span className="block text-[8px] uppercase tracking-tighter text-[#d4af37]" translate="no">الجديد</span>
                  <span className="block text-lg font-serif leading-none text-[#d4af37]" translate="no">م</span>
                </div>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-[#0a4d28]">মাদ্রাসা ম্যানেজমেন্ট পোর্টাল</h1>
                <p className="text-xs text-slate-500 hidden sm:block">অ্যাডমিন ও কনটেন্ট ম্যানেজমেন্ট সিস্টেম</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('home')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              লাইভ সাইট দেখুন
            </button>
          </div>
        </header>

        {/* Login Form Container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div id="admin-login-screen" className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-900 text-amber-300 mx-auto flex items-center justify-center shadow-inner">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">মাদ্রাসা ম্যানেজমেন্ট পোর্টাল</h2>
              <p className="text-xs text-slate-500">
                ডাঃ আহমেদ উল্ল্যা-ছালেহা আল-জাদিদ মাদ্রাসা
              </p>
            </div>

            {/* Demo Quick Logins */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                দ্রুত প্রবেশাধিকার (Demo One-Click Login):
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="quick-login-superadmin"
                  onClick={() => login('super_admin', 'superadmin@madrasa.edu.bd')}
                  className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold text-center shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Super Admin
                </button>
                <button
                  id="quick-login-admin"
                  onClick={() => login('admin', 'admin@madrasa.edu.bd')}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold text-center shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Admin
                </button>
                <button
                  id="quick-login-founder"
                  onClick={() => login('founder', 'founder@madrasa.edu.bd')}
                  className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold text-center shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Founder
                </button>
              </div>
            </div>

            {/* Custom Login Form */}
            <form
              id="custom-login-form"
              onSubmit={(e) => {
                e.preventDefault();
                login(loginRole, loginEmail || undefined);
              }}
              className="space-y-3 pt-2 border-t border-slate-100"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">পদবী / ভূমিকা (Role)</label>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value as any)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-medium bg-white"
                >
                  <option value="super_admin">সুপার অ্যাডমিনিস্ট্রেটর (Super Admin)</option>
                  <option value="admin">সাধারণ অ্যাডমিন (Admin)</option>
                  <option value="founder">মাদ্রাসা প্রতিষ্ঠাতা / আজীবন সদস্য (Founder)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ইমেইল (Email)</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@madrasa.edu.bd"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">পাসওয়ার্ড (Password)</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 mt-2 cursor-pointer min-h-[44px]"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>লগইন করুন (Enter Portal)</span>
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveTab('home')}
                className="text-xs text-emerald-800 hover:underline font-semibold cursor-pointer"
              >
                ← মূল ওয়েবসাইটে ফিরে যান
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-portal-root" className="min-h-screen bg-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-600 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. FIXED / STICKY PORTAL NAVIGATION HEADER (Matching Main Website) */}
      <header id="admin-portal-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0a4d28]/15 shadow-sm">
        {/* Top Dark Green Utility Bar */}
        <div className="bg-[#1a2e1a] text-emerald-100 text-xs py-1 px-4 sm:px-6 border-b border-[#0a4d28]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
            {/* Left: Role status */}
            <div className="flex items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 font-semibold text-[#d4af37] bg-[#d4af37]/15 px-2 py-0.5 rounded border border-[#d4af37]/30">
                <Shield className="w-3 h-3 text-[#d4af37]" />
                <span>{isSuperAdmin ? 'Super Admin' : isFounder ? 'Founder' : 'Admin'}</span>
              </span>
              <span className="hidden sm:inline text-emerald-200/90 truncate max-w-[200px] md:max-w-none">
                {currentUser.name} ({currentUser.email})
              </span>
            </div>

            {/* Right: Quick actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Language Switcher Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1 bg-[#0a4d28] hover:bg-[#083e20] text-white px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all border border-[#d4af37]/40 cursor-pointer"
                >
                  <span>{language === 'bn' ? '🇧🇩' : language === 'ar' ? '🇸🇦' : '🇬🇧'}</span>
                  <span>{language === 'bn' ? 'বাংলা' : language === 'ar' ? 'العربية' : 'EN'}</span>
                  <span className="text-[8px] text-emerald-300">▼</span>
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 p-1 z-50 text-xs animate-in fade-in">
                    <button
                      onClick={() => { setLanguage('bn'); setLangDropdownOpen(false); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${language === 'bn' ? 'bg-emerald-50 text-[#0a4d28] font-bold' : 'hover:bg-slate-100'}`}
                    >
                      <span>🇧🇩</span>
                      <span>বাংলা</span>
                    </button>
                    <button
                      onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${language === 'en' ? 'bg-emerald-50 text-[#0a4d28] font-bold' : 'hover:bg-slate-100'}`}
                    >
                      <span>🇬🇧</span>
                      <span>English</span>
                    </button>
                    <button
                      onClick={() => { setLanguage('ar'); setLangDropdownOpen(false); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${language === 'ar' ? 'bg-emerald-50 text-[#0a4d28] font-bold' : 'hover:bg-slate-100'}`}
                    >
                      <span>🇸🇦</span>
                      <span>العربية</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Server Sync Button */}
              <button
                onClick={async () => {
                  await saveDataToServer();
                  showToast('সার্ভারে ডেটা সিঙ্ক সম্পন্ন হয়েছে!');
                }}
                disabled={isSaving}
                className="px-2.5 py-0.5 rounded-md bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
                title="সার্ভার সিঙ্ক"
              >
                <Save className="w-3 h-3" />
                <span>{isSaving ? 'সিঙ্ক...' : 'সিঙ্ক'}</span>
              </button>

              {/* Live Website Link */}
              <button
                onClick={() => setActiveTab('home')}
                className="px-2.5 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-100 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Eye className="w-3 h-3 text-[#d4af37]" />
                <span className="hidden sm:inline">মূল ওয়েবসাইট</span>
                <span className="sm:hidden">সাইট</span>
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                className="px-2 py-0.5 rounded-md bg-red-900/80 hover:bg-red-800 text-red-100 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Header Brand Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-2.5 sm:py-3 gap-2">
            {/* Logo & Title */}
            <div
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0a4d28] to-[#1a2e1a] text-[#d4af37] flex items-center justify-center shadow-md border-2 border-[#d4af37] group-hover:scale-105 transition-transform flex-shrink-0" translate="no">
                <div className="text-center font-bold" translate="no">
                  <span className="block text-[8px] uppercase tracking-tighter text-[#d4af37]" translate="no">الجديد</span>
                  <span className="block text-lg font-serif leading-none text-[#d4af37]" translate="no">م</span>
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-sm sm:text-base md:text-lg font-bold text-[#0a4d28] leading-tight truncate">
                    মাদ্রাসা ম্যানেজমেন্ট পোর্টাল
                  </h1>
                  <span className="hidden md:inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                    CMS Control Panel
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                  {getLocalized(data.settings.name, language)}
                </p>
              </div>
            </div>

            {/* Right Action: Active module pill & Mobile Menu trigger */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Active Module Indicator (Desktop & Tablet) */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <Layers className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block leading-tight uppercase font-bold">সক্রিয় মডিউল</span>
                  <span className="font-bold text-slate-900 truncate block text-xs">{activeItemInfo?.label || 'ড্যাশবোর্ড'}</span>
                </div>
              </div>

              {/* Mobile / Tablet Menu Button (lg:hidden) */}
              <button
                id="portal-mobile-menu-trigger"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden px-3 py-2 rounded-xl bg-[#0a4d28] hover:bg-[#083e20] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer min-h-[40px]"
                aria-label="Toggle Portal Modules"
              >
                {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                <span className="hidden sm:inline">মডিউল মেনু</span>
                <span className="sm:hidden">মেনু</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Horizontal Scrollable Module Chips for Mobile & Tablet (< lg) */}
        <div className="lg:hidden border-t border-slate-100 bg-slate-50/80 px-3 py-2">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {allNavItems
              .filter(item => item.allowed)
              .map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer min-h-[36px] ${
                      isActive
                        ? 'bg-[#0a4d28] text-white shadow-xs font-bold'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : item.color}`} />
                    <span>{item.label}</span>
                    {item.count !== null && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-emerald-950 text-amber-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </header>

      {/* 2. MOBILE / TABLET MODULE DRAWER MODAL (Accordion Structured like Main Website) */}
      {mobileNavOpen && (
        <div
          id="portal-mobile-drawer-backdrop"
          className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setMobileNavOpen(false)}
        >
          <div
            id="portal-mobile-drawer-content"
            className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-5 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0a4d28] text-[#d4af37] flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">প্রশাসনিক মডিউলসমূহ</h3>
                  <p className="text-[11px] text-slate-400">যে কোনো মডিউলে সরাসরি প্রবেশ করুন</p>
                </div>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Accordion Grouped List matching Main Site */}
            <div className="space-y-2 overflow-y-auto pr-1">
              {moduleGroups.map(group => {
                const allowedItems = group.items.filter(item => item.allowed);
                if (allowedItems.length === 0) return null;

                const GroupIcon = group.icon;
                const isGroupOpen = openGroups[group.key] ?? true;
                const hasActiveItem = allowedItems.some(i => i.id === activeSection);

                return (
                  <div key={group.key} className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50">
                    <button
                      onClick={() => toggleGroup(group.key)}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer min-h-[44px] ${
                        hasActiveItem ? 'text-[#0a4d28] bg-emerald-50/80' : 'text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <GroupIcon className={`w-4 h-4 ${hasActiveItem ? 'text-[#0a4d28]' : 'text-slate-500'}`} />
                        <span>{group.title}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isGroupOpen ? 'rotate-180 text-[#0a4d28]' : 'text-slate-400'}`} />
                    </button>

                    {isGroupOpen && (
                      <div className="bg-white border-t border-slate-200/70 p-2 space-y-1.5">
                        {allowedItems.map(item => {
                          const Icon = item.icon;
                          const isActive = activeSection === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveSection(item.id);
                                setMobileNavOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer min-h-[44px] ${
                                isActive
                                  ? 'bg-[#0a4d28] text-white shadow-xs font-bold'
                                  : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#d4af37]' : item.color}`} />
                                <div className="truncate">
                                  <div className="font-semibold truncate">{item.label}</div>
                                  {item.desc && (
                                    <div className={`text-[10px] truncate ${isActive ? 'text-emerald-200' : 'text-slate-400'}`}>
                                      {item.desc}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {item.count !== null && (
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ml-2 flex-shrink-0 ${
                                  isActive ? 'bg-emerald-950 text-amber-300' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {item.count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Live Site Button at bottom of drawer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setMobileNavOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
              >
                <Eye className="w-4 h-4 text-[#0a4d28]" />
                <span>মূল ওয়েবসাইটে ফিরে যান</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT CONTAINER (Desktop Structured Sidebar + Fluid Content Panel) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* DESKTOP SIDEBAR NAVIGATION (Structured & Styled Like Main Website) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-3 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 scrollbar-thin">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-xs flex-shrink-0 ${
                isSuperAdmin ? 'bg-[#0a4d28] text-[#d4af37]' : isFounder ? 'bg-amber-600 text-white' : 'bg-blue-700 text-white'
              }`}>
                {isSuperAdmin ? <Shield className="w-5 h-5" /> : isFounder ? <UserCheck className="w-5 h-5" /> : <Key className="w-5 h-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded uppercase mt-0.5 ${
                  isSuperAdmin ? 'bg-emerald-100 text-emerald-900' : isFounder ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-800'
                }`}>
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Structured Module Groups Navigation */}
            {moduleGroups.map(group => {
              const allowedItems = group.items.filter(item => item.allowed);
              if (allowedItems.length === 0) return null;

              const GroupIcon = group.icon;
              const isGroupOpen = openGroups[group.key] ?? true;
              const hasActiveItem = allowedItems.some(i => i.id === activeSection);

              return (
                <div key={group.key} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.key)}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      hasActiveItem ? 'bg-emerald-50/70 text-[#0a4d28]' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GroupIcon className={`w-3.5 h-3.5 ${hasActiveItem ? 'text-[#0a4d28]' : 'text-slate-400'}`} />
                      <span className="text-[11px] uppercase tracking-wider">{group.title}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isGroupOpen ? 'rotate-180 text-[#0a4d28]' : 'text-slate-400'}`} />
                  </button>

                  {/* Group Module Items */}
                  {isGroupOpen && (
                    <div className="p-1.5 space-y-1 border-t border-slate-100">
                      {allowedItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[#0a4d28] text-white shadow-xs font-bold border-l-4 border-[#d4af37]'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-[#0a4d28]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#d4af37]' : item.color}`} />
                              <span className="truncate text-xs">{item.label}</span>
                            </div>

                            {item.count !== null && (
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ml-1 flex-shrink-0 ${
                                isActive ? 'bg-emerald-950 text-amber-300' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {item.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </aside>

          {/* FLUID CONTENT PANEL (Responsive Across All Devices) */}
          <div className="w-full lg:col-span-9 bg-white rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-xs min-h-[500px] overflow-hidden">
            {/* 1. Overview */}
            {activeSection === 'overview' && !isFounder && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">ড্যাশবোর্ড ওভারভিউ ও কন্টেন্ট স্ট্যাটাস</h2>
                  <p className="text-xs text-slate-500">
                    ওয়েবসাইটে প্রদর্শিত বিভিন্ন মডিউলের রিয়েল-টাইম তথ্য এবং সার্বিক পরিসংখ্যান।
                  </p>
                </div>

                {/* Module Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { id: 'teachers', label: 'শিক্ষকমণ্ডলী', count: data.teachers.length, icon: GraduationCap, color: 'border-blue-200 bg-blue-50/40 text-blue-900' },
                    { id: 'founders', label: 'প্রতিষ্ঠাতাগণ', count: data.founders.length, icon: Users, color: 'border-amber-200 bg-amber-50/40 text-amber-900' },
                    { id: 'notices', label: 'নোটিশ বোর্ড', count: data.notices.length, icon: Bell, color: 'border-amber-200 bg-amber-50/40 text-amber-900' },
                    { id: 'events', label: 'ইভেন্ট ও মাহফিল', count: data.events.length, icon: Calendar, color: 'border-emerald-200 bg-emerald-50/40 text-emerald-900' },
                    { id: 'audio', label: 'অডিও তিলাওয়াত', count: data.audio.length, icon: Music, color: 'border-purple-200 bg-purple-50/40 text-purple-900' },
                    { id: 'video', label: 'ভিডিও গ্যালারি', count: data.videos.length, icon: Video, color: 'border-red-200 bg-red-50/40 text-red-900' },
                    { id: 'gallery', label: 'ফটো গ্যালারি', count: data.gallery.length, icon: Image, color: 'border-teal-200 bg-teal-50/40 text-teal-900' },
                    { id: 'downloads', label: 'ডাউনলোড ফাইল', count: data.downloads.length, icon: FileText, color: 'border-indigo-200 bg-indigo-50/40 text-indigo-900' },
                    { id: 'contacts', label: 'বার্তা ইনবক্স', count: data.contacts?.length || 0, icon: MessageSquare, color: 'border-sky-200 bg-sky-50/40 text-sky-900' },
                    { id: 'users', label: 'অ্যাডমিন ইউজার', count: data.users.length, icon: ShieldCheck, color: 'border-emerald-200 bg-emerald-50/40 text-emerald-900' }
                  ].map(card => {
                    const Icon = card.icon;
                    return (
                      <button
                        key={card.id}
                        onClick={() => setActiveSection(card.id as any)}
                        className={`p-3.5 sm:p-4 rounded-2xl border ${card.color} text-left flex flex-col justify-between gap-2 hover:shadow-xs transition-all cursor-pointer min-h-[90px]`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className="w-5 h-5" />
                          <span className="text-lg sm:text-xl font-extrabold font-mono">{card.count}</span>
                        </div>
                        <div className="text-xs font-bold truncate">{card.label}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Activity Logs Peek */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-800" />
                      <span>সাম্প্রতিক সিস্টেম অডিট লগ (Recent Activity Logs)</span>
                    </h3>
                    <button
                      onClick={() => setActiveSection('logs')}
                      className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                    >
                      সব দেখুন →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(data.activityLogs || []).slice(0, 4).map(log => (
                      <div
                        key={log.id}
                        className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold text-slate-800">{log.action}</span>
                          <span className="text-slate-500 truncate">• {log.target}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                          {log.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. My Profile (Founder) */}
            {activeSection === 'my_profile' && <FounderProfileEditor />}

            {/* 3. Teachers */}
            {activeSection === 'teachers' && <TeachersManager />}

            {/* 4. Founders */}
            {activeSection === 'founders' && <FoundersManager />}

            {/* 5. History */}
            {activeSection === 'history' && <HistoryManager />}

            {/* 6. Notices */}
            {activeSection === 'notices' && <NoticesManager />}

            {/* 7. Events */}
            {activeSection === 'events' && <EventsManager />}

            {/* 8. Audio */}
            {activeSection === 'audio' && <AudioManager />}

            {/* 9. Video */}
            {activeSection === 'video' && <VideoManager />}

            {/* 10. Gallery */}
            {activeSection === 'gallery' && <GalleryManager />}

            {/* 11. Downloads */}
            {activeSection === 'downloads' && <DownloadsManager />}

            {/* 12. Contacts */}
            {activeSection === 'contacts' && <ContactsManager />}

            {/* 13. Users & Permissions */}
            {activeSection === 'users' && <UserPermissionsManager />}

            {/* 14. Settings */}
            {activeSection === 'settings' && <SettingsManager />}

            {/* 15. Backup & Restore */}
            {activeSection === 'backup' && <BackupManager />}

            {/* 16. Security & Audit Logs */}
            {activeSection === 'logs' && <ActivityLogsViewer />}
          </div>
        </div>
      </main>
    </div>
  );
};

