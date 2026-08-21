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
  Layers
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { AdminPermission } from '../../types';
import { hasPermission } from '../../lib/security';

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
  const [activeSection, setActiveSection] = useState<
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
    | 'logs'
  >('overview');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  // If not logged in, show Login Screen
  if (!currentUser) {
    return (
      <div id="admin-login-screen" className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-900 text-amber-300 mx-auto flex items-center justify-center shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">মাদ্রাসা ম্যানেজমেন্ট পোর্টাল</h2>
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
              className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold text-center shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Super Admin
            </button>
            <button
              id="quick-login-admin"
              onClick={() => login('admin', 'admin@madrasa.edu.bd')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold text-center shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Admin
            </button>
            <button
              id="quick-login-founder"
              onClick={() => login('founder', 'founder@madrasa.edu.bd')}
              className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold text-center shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer"
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
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
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
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">পাসওয়ার্ড (Password)</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-amber-300" />
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
    );
  }

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isFounder = currentUser.role === 'founder';

  // Navigation Items with Permission Enforcement
  const navItems = [
    {
      id: 'overview',
      label: 'ড্যাশবোর্ড ওভারভিউ',
      icon: Sparkles,
      allowed: !isFounder,
      count: null,
      color: 'text-emerald-700'
    },
    {
      id: 'my_profile',
      label: 'আমার প্রতিষ্ঠাতা প্রোফাইল',
      icon: UserCheck,
      allowed: isFounder,
      count: null,
      color: 'text-amber-600'
    },
    {
      id: 'teachers',
      label: 'শিক্ষকমণ্ডলী তালিকা',
      icon: User,
      allowed: isSuperAdmin || hasPermission(currentUser, 'manage_teachers'),
      count: data.teachers?.length || 0,
      color: 'text-blue-600'
    },
    {
      id: 'founders',
      label: 'প্রতিষ্ঠাতা পরিচিতি',
      icon: Users,
      allowed: isSuperAdmin || hasPermission(currentUser, 'manage_founders'),
      count: data.founders?.length || 0,
      color: 'text-amber-700'
    },
    {
      id: 'history',
      label: 'ইতিহাস ও ঐতিহ্য',
      icon: BookOpen,
      allowed: isSuperAdmin || hasPermission(currentUser, 'manage_history'),
      count: data.history?.milestones?.length || 0,
      color: 'text-teal-700'
    },
    {
      id: 'notices',
      label: 'নোটিশ বোর্ড',
      icon: Bell,
      allowed: isSuperAdmin || hasPermission(currentUser, 'manage_notices'),
      count: data.notices?.length || 0,
      color: 'text-amber-600'
    },
    {
      id: 'events',
      label: 'ইভেন্ট ও মাহফিল',
      icon: Calendar,
      allowed: isSuperAdmin || hasPermission(currentUser, 'manage_events'),
      count: data.events?.length || 0,
      color: 'text-emerald-600'
    },
    {
      id: 'audio',
      label: 'অডিও তিলাওয়াত',
      icon: Music,
      allowed: isSuperAdmin || hasPermission(currentUser, 'manage_audio'),
      count: data.audio?.length || 0,
      color: 'text-purple-600'
    },
    {
      id: 'video',
      label: 'ভিডিও ও বয়ান',
      icon: Video,
      allowed: isSuperAdmin || hasPermission(currentUser, 'manage_video'),
      count: data.videos?.length || 0,
      color: 'text-red-600'
    },
    {
      id: 'gallery',
      label: 'ফটো গ্যালারি',
      icon: Image,
      allowed: isSuperAdmin || hasPermission(currentUser, 'manage_gallery'),
      count: data.gallery?.length || 0,
      color: 'text-teal-600'
    },
    {
      id: 'downloads',
      label: 'ডাউনলোড ও ফরম',
      icon: FileText,
      allowed: isSuperAdmin || hasPermission(currentUser, 'manage_downloads'),
      count: data.downloads?.length || 0,
      color: 'text-indigo-600'
    },
    {
      id: 'contacts',
      label: 'বার্তা ইনবক্স',
      icon: MessageSquare,
      allowed: isSuperAdmin || hasPermission(currentUser, 'manage_contacts'),
      count: data.contacts?.length || 0,
      color: 'text-sky-600'
    },
    {
      id: 'users',
      label: 'ইউজার ও পারমিশন',
      icon: ShieldCheck,
      allowed: isSuperAdmin || hasPermission(currentUser, 'manage_users'),
      count: data.users?.length || 0,
      color: 'text-emerald-800'
    },
    {
      id: 'settings',
      label: 'প্রাতিষ্ঠানিক সেটিংস',
      icon: Settings,
      allowed: isSuperAdmin || hasPermission(currentUser, 'manage_settings'),
      count: null,
      color: 'text-slate-600'
    },
    {
      id: 'backup',
      label: 'ব্যাকআপ ও রিস্টোর',
      icon: HardDrive,
      allowed: isSuperAdmin,
      count: null,
      color: 'text-emerald-700'
    },
    {
      id: 'logs',
      label: 'সিকিউরিটি অডিট লগ',
      icon: Activity,
      allowed: isSuperAdmin || hasPermission(currentUser, 'manage_settings'),
      count: data.activityLogs?.length || 0,
      color: 'text-slate-700'
    }
  ];

  return (
    <div id="admin-portal-main" className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-600 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner with User Status */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0 w-full md:w-auto">
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-xs flex-shrink-0 ${
            isSuperAdmin
              ? 'bg-emerald-900 text-amber-300'
              : isFounder
              ? 'bg-amber-600 text-white'
              : 'bg-blue-700 text-white'
          }`}>
            {isSuperAdmin ? <Shield className="w-5 h-5 sm:w-6 sm:h-6" /> : isFounder ? <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" /> : <Key className="w-5 h-5 sm:w-6 sm:h-6" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-xl font-bold text-slate-900 truncate">
                {currentUser.name}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                isSuperAdmin
                  ? 'bg-emerald-800 text-amber-200'
                  : isFounder
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {isSuperAdmin ? 'Super Admin' : isFounder ? 'Founder' : 'Admin'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {currentUser.email} • {isSuperAdmin ? 'পূর্ণ প্রশাসনিক অধিকার' : isFounder ? 'প্রতিষ্ঠাতা প্রোফাইল নিয়ন্ত্রণ' : `অনুমোদিত মডিউল: ${(currentUser.permissions || []).length} টি`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
          {/* Admin Panel Language Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                language === 'bn'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇧🇩</span>
              <span className="hidden sm:inline">বাংলা</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                language === 'ar'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🇸🇦</span>
              <span className="hidden sm:inline">العربية</span>
            </button>
          </div>

          <button
            onClick={async () => {
              await saveDataToServer();
              showToast('সার্ভারে ডেটা সিঙ্ক সম্পন্ন হয়েছে!');
            }}
            disabled={isSaving}
            className="px-3 sm:px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="সার্ভার সিঙ্ক"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সিঙ্ক'}</span>
          </button>

          <button
            onClick={() => setActiveTab('home')}
            className="px-3 sm:px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">লাইভ সাইট</span>
            <span className="sm:hidden">সাইট</span>
          </button>

          <button
            onClick={logout}
            className="px-3 sm:px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-semibold text-xs flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Quick Navigation Bar (< lg) */}
      <div className="lg:hidden space-y-3" id="admin-mobile-nav-section">
        {/* Active Module Header & Menu Trigger Button */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">বর্তমান মডিউল</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {navItems.find(i => i.id === activeSection)?.label || 'ড্যাশবোর্ড'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileNavOpen(true)}
            className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs flex-shrink-0 cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span>মডিউল মেনু</span>
          </button>
        </div>

        {/* Quick Horizontal Scrolling Tabs for Mobile & Tablet */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {navItems
            .filter(item => item.allowed)
            .map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
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

      {/* Mobile Module Drawer Modal */}
      {mobileNavOpen && (
        <div
          id="admin-mobile-drawer-backdrop"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setMobileNavOpen(false)}
        >
          <div
            id="admin-mobile-drawer-content"
            className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-5 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">প্রশাসনিক মডিউলসমূহ</h3>
                  <p className="text-[11px] text-slate-400">যে কোনো মডিউলে দ্রুত প্রবেশ করুন</p>
                </div>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1">
              {navItems
                .filter(item => item.allowed)
                .map(item => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id as any);
                        setMobileNavOpen(false);
                      }}
                      className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-200/80 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-300' : item.color}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.count !== null && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-emerald-950 text-amber-300' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Layout: Desktop Sidebar + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Sidebar Navigation */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-3 border border-slate-200 shadow-xs space-y-1 sticky top-20">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            নিয়ন্ত্রণ মডিউলসমূহ
          </div>

          <div className="space-y-1">
            {navItems
              .filter(item => item.allowed)
              .map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as any)}
                    className={`w-full p-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-300' : item.color}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.count !== null && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-emerald-900/60 text-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="w-full lg:col-span-9 bg-white rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-xs min-h-[500px]">
          {/* 1. Overview */}
          {activeSection === 'overview' && !isFounder && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-xl font-bold text-slate-900">ড্যাশবোর্ড ওভারভিউ ও কন্টেন্ট স্ট্যাটাস</h2>
                <p className="text-xs text-slate-500">
                  ওয়েবসাইটে প্রদর্শিত বিভিন্ন মডিউলের রিয়েল-টাইম তথ্য এবং সার্বিক পরিসংখ্যান।
                </p>
              </div>

              {/* Module Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {[
                  { id: 'teachers', label: 'শিক্ষকমণ্ডলী', count: data.teachers.length, icon: User, color: 'border-blue-200 bg-blue-50/40 text-blue-900' },
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
                      className={`p-4 rounded-2xl border ${card.color} text-left flex flex-col justify-between gap-2 hover:shadow-xs transition-all cursor-pointer`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="w-5 h-5" />
                        <span className="text-xl font-extrabold font-mono">{card.count}</span>
                      </div>
                      <div className="text-xs font-bold truncate">{card.label}</div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Activity Logs Peek */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
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
                      className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
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
    </div>
  );
};
