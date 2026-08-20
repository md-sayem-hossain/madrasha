import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  MadrasaDatabase,
  UserAccount,
  AdminPermission,
  AudioTrack,
  Founder,
  ContactMessage,
  UserRole,
  Teacher,
  Notice,
  EventItem,
  GalleryItem,
  DownloadItem,
  VideoItem,
  HistoryMilestone
} from '../types';
import { initialMadrasaData } from '../data/initialData';

interface MadrasaContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: UserAccount | null;
  setCurrentUser: (user: UserAccount | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  data: MadrasaDatabase;
  updateData: (updater: (prev: MadrasaDatabase) => MadrasaDatabase) => void;
  saveDataToServer: (newData: MadrasaDatabase) => Promise<void>;
  
  // Global Audio Player
  currentTrack: AudioTrack | null;
  isPlayingAudio: boolean;
  playTrack: (track: AudioTrack) => void;
  togglePlayAudio: () => void;
  stopAudio: () => void;

  // Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Selected view details modal helpers
  selectedTeacher: Teacher | null;
  setSelectedTeacher: (t: Teacher | null) => void;
  selectedFounder: Founder | null;
  setSelectedFounder: (f: Founder | null) => void;
  selectedNotice: Notice | null;
  setSelectedNotice: (n: Notice | null) => void;
  selectedVideo: VideoItem | null;
  setSelectedVideo: (v: VideoItem | null) => void;
  galleryLightboxIndex: number | null;
  setGalleryLightboxIndex: (idx: number | null) => void;

  // Quick Action helpers
  submitContactForm: (msg: { name: string; email: string; phone: string; subject: string; message: string }) => Promise<{ success: boolean; message: string }>;
  submitFounderUpdateProposal: (founderId: string, proposedData: Partial<Founder>) => void;
  approveFounderUpdateProposal: (founderId: string, notes?: string) => void;
  rejectFounderUpdateProposal: (founderId: string, notes?: string) => void;
  addActivityLog: (action: string, target: string, details: string) => void;
  resetToInitialSeed: () => void;

  // User & Permission Management Helpers
  updateUserPermissions: (userId: string, permissions: AdminPermission[]) => void;
  updateUserAccount: (userId: string, update: Partial<UserAccount>) => void;
  addUserAccount: (user: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  deleteUserAccount: (userId: string) => void;

  // Auth Helpers
  login: (role?: UserRole | string, email?: string) => boolean;
  logout: () => void;
  isSaving: boolean;
}

const STORAGE_KEY = 'al_jadid_madrasa_db_v2';
const LANG_STORAGE_KEY = 'al_jadid_madrasa_lang';

const MadrasaContext = createContext<MadrasaContextType | undefined>(undefined);

const normalizeMadrasaData = (incoming: Partial<MadrasaDatabase> | null | undefined): MadrasaDatabase => {
  return {
    ...initialMadrasaData,
    ...incoming,

    settings: {
      ...initialMadrasaData.settings,
      ...(incoming?.settings || {}),

      emergencyNotice: {
        ...initialMadrasaData.settings.emergencyNotice,
        ...(incoming?.settings?.emergencyNotice || {})
      }
    },

    teachers: incoming?.teachers || initialMadrasaData.teachers,
    founders: incoming?.founders || initialMadrasaData.founders,
    notices: incoming?.notices || initialMadrasaData.notices,
    events: incoming?.events || initialMadrasaData.events,
    gallery: incoming?.gallery || initialMadrasaData.gallery,
    audio: incoming?.audio || initialMadrasaData.audio,
    videos: incoming?.videos || initialMadrasaData.videos,
    downloads: incoming?.downloads || initialMadrasaData.downloads,
    users: incoming?.users || initialMadrasaData.users,
    contacts: incoming?.contacts || initialMadrasaData.contacts,
    activityLogs: incoming?.activityLogs || initialMadrasaData.activityLogs
  };
};

export const MadrasaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
    return saved === 'en' || saved === 'ar' || saved === 'bn' ? saved : 'bn';
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const savedUser = localStorage.getItem('al_jadid_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch {
      // ignore
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Modals state
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedFounder, setSelectedFounder] = useState<Founder | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [galleryLightboxIndex, setGalleryLightboxIndex] = useState<number | null>(null);

  // Audio State
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Initialize Database from LocalStorage or InitialSeed
const [data, setData] = useState<MadrasaDatabase>(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      return normalizeMadrasaData(parsed);
    }
  } catch (e) {
    console.warn('Failed to load local DB state:', e);
  }

  return normalizeMadrasaData(initialMadrasaData);
});

  // Sync language with HTML document dir and lang attributes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Attempt to load from server on mount
  useEffect(() => {
    fetch('/api/madrasa/data')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
  const normalizedData = normalizeMadrasaData(resData.data);

  setData(normalizedData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedData));
}
      })
      .catch(() => {
        // Silently use local store
      });
  }, []);

  const saveDataToServer = async (newData: MadrasaDatabase) => {
    setIsSaving(true);
    try {
      await fetch('/api/madrasa/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
    } catch (err) {
      console.error('Server sync error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateData = (updater: (prev: MadrasaDatabase) => MadrasaDatabase) => {
    setData(prev => {
      const updated = updater(prev);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      saveDataToServer(updated);
      return updated;
    });
  };

  const addActivityLog = (action: string, target: string, details: string) => {
    const user = currentUser || {
      id: 'guest',
      name: 'ভিজিটর (Visitor)',
      role: 'visitor' as UserRole
    };

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US'),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      target,
      details
    };

    updateData(prev => ({
      ...prev,
      activityLogs: [newLog, ...(prev.activityLogs || [])]
    }));
  };

  const playTrack = (track: AudioTrack) => {
    setCurrentTrack(track);
    setIsPlayingAudio(true);
    // increment playcount
    updateData(prev => ({
      ...prev,
      audio: prev.audio.map(a => a.id === track.id ? { ...a, playCount: (a.playCount || 0) + 1 } : a)
    }));
  };

  const togglePlayAudio = () => {
    if (!currentTrack && data.audio.length > 0) {
      playTrack(data.audio[0]);
    } else {
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  const stopAudio = () => {
    setIsPlayingAudio(false);
    setCurrentTrack(null);
  };

  const submitContactForm = async (msgData: { name: string; email: string; phone: string; subject: string; message: string }) => {
    const newContact: ContactMessage = {
      id: `cnt-${Date.now()}`,
      name: msgData.name,
      email: msgData.email,
      phone: msgData.phone,
      subject: msgData.subject || 'সাধারন অনুসন্ধান',
      message: msgData.message,
      date: new Date().toISOString().split('T')[0],
      isRead: false,
      replyStatus: 'pending'
    };

    updateData(prev => ({
      ...prev,
      contacts: [newContact, ...(prev.contacts || [])]
    }));

    addActivityLog('বার্তা প্রেরণ (Contact Message)', msgData.name, `বিষয়: ${msgData.subject}`);

    return { success: true, message: 'Message sent successfully' };
  };

  const submitFounderUpdateProposal = (founderId: string, proposedData: Partial<Founder>) => {
    updateData(prev => ({
      ...prev,
      founders: prev.founders.map(f => {
        if (f.id === founderId) {
          return {
            ...f,
            pendingUpdate: proposedData,
            updateSubmittedAt: new Date().toISOString(),
            reviewerNotes: undefined
          };
        }
        return f;
      })
    }));

    addActivityLog('প্রতিষ্ঠাতা প্রোফাইল আপডেট দাখিল', founderId, 'নতুন তথ্য অনুমোদনের জন্য অপেক্ষমাণ।');
  };

  const approveFounderUpdateProposal = (founderId: string, notes?: string) => {
    updateData(prev => ({
      ...prev,
      founders: prev.founders.map(f => {
        if (f.id === founderId && f.pendingUpdate) {
          return {
            ...f,
            ...f.pendingUpdate,
            pendingUpdate: undefined,
            updateSubmittedAt: undefined,
            reviewerNotes: notes,
            isApproved: true
          };
        }
        return f;
      })
    }));

    addActivityLog('প্রতিষ্ঠাতা প্রোফাইল অনুমোদন', founderId, `সুপার অ্যাডমিন কর্তৃক অনুমোদিত ও প্রকাশিত। নোট: ${notes || 'কোনো মন্তব্য নেই'}`);
  };

  const rejectFounderUpdateProposal = (founderId: string, notes?: string) => {
    updateData(prev => ({
      ...prev,
      founders: prev.founders.map(f => {
        if (f.id === founderId) {
          return {
            ...f,
            pendingUpdate: undefined,
            reviewerNotes: notes || 'সুপার অ্যাডমিন কর্তৃক বাতিল করা হয়েছে।'
          };
        }
        return f;
      })
    }));

    addActivityLog('প্রতিষ্ঠাতা প্রোফাইল প্রত্যাখ্যান', founderId, `বাতিলকৃত। কারণ: ${notes || 'কোনো কারণ উল্লেখ নেই'}`);
  };

  const resetToInitialSeed = () => {
    setData(initialMadrasaData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMadrasaData));
    saveDataToServer(initialMadrasaData);
    addActivityLog('সিস্টেম রিসেট', 'ডিফল্ট ডেটাবেজ', 'প্রাথমিক সিড ডেটায় রিসেট করা হয়েছে।');
  };

  const updateUserPermissions = (userId: string, permissions: AdminPermission[]) => {
    updateData(prev => {
      const updatedUsers = prev.users.map(u => {
        if (u.id === userId) {
          return { ...u, permissions };
        }
        return u;
      });
      return { ...prev, users: updatedUsers };
    });

    if (currentUser && currentUser.id === userId) {
      const updated = { ...currentUser, permissions };
      setCurrentUser(updated);
      localStorage.setItem('al_jadid_user', JSON.stringify(updated));
    }

    addActivityLog('পারমিশন পরিবর্তন', `ইউজার ID: ${userId}`, `অনুমতি তালিকা আপডেট করা হয়েছে: ${permissions.join(', ')}`);
  };

  const updateUserAccount = (userId: string, update: Partial<UserAccount>) => {
    updateData(prev => {
      const updatedUsers = prev.users.map(u => {
        if (u.id === userId) {
          return { ...u, ...update };
        }
        return u;
      });
      return { ...prev, users: updatedUsers };
    });

    if (currentUser && currentUser.id === userId) {
      const updated = { ...currentUser, ...update };
      setCurrentUser(updated as UserAccount);
      localStorage.setItem('al_jadid_user', JSON.stringify(updated));
    }

    addActivityLog('ইউজার আপডেট', update.name || userId, 'ইউজার অ্যাকাউন্ট বিবরণী সংশোধন করা হয়েছে।');
  };

  const addUserAccount = (user: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const newUser: UserAccount = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    updateData(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));

    addActivityLog('নতুন ইউজার তৈরি', newUser.name, `ভূমিকা: ${newUser.role}, ইমেইল: ${newUser.email}`);
  };

  const deleteUserAccount = (userId: string) => {
    const targetUser = data.users.find(u => u.id === userId);
    updateData(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== userId)
    }));

    if (targetUser) {
      addActivityLog('ইউজার মুছে ফেলা', targetUser.name, `অ্যাকাউন্ট ডিলিট করা হয়েছে (ID: ${userId})`);
    }
  };

  const login = (role?: UserRole | string, email?: string) => {
    let matchedUser = data.users?.find(u => 
      (email && u.email?.toLowerCase() === email.toLowerCase()) || 
      (role && u.role === role)
    );

    if (!matchedUser) {
      if (role === 'founder') {
        matchedUser = {
          id: 'usr-3',
          name: 'ডাঃ আহমেদ উল্ল্যা (প্রতিষ্ঠাতা)',
          username: 'founder_ahmed',
          email: email || 'founder@madrasa.edu.bd',
          role: 'founder',
          permissions: [],
          linkedFounderId: 'founder-1',
          isActive: true,
          createdAt: '2024-01-01'
        };
      } else if (role === 'admin') {
        matchedUser = {
          id: 'usr-2',
          name: 'মিডিয়া ও কন্টেন্ট অ্যাডমিন',
          username: 'admin_media',
          email: email || 'admin@madrasa.edu.bd',
          role: 'admin',
          permissions: ['manage_gallery', 'manage_audio', 'manage_video', 'manage_notices', 'manage_events', 'manage_downloads'],
          isActive: true,
          createdAt: '2024-02-01'
        };
      } else {
        matchedUser = {
          id: 'usr-1',
          name: 'মুফতী মাওলানা মোহাম্মদ (সুপার অ্যাডমিন)',
          username: 'superadmin',
          email: email || 'superadmin@madrasa.edu.bd',
          role: 'super_admin',
          permissions: [
            'manage_teachers', 'manage_founders', 'manage_history', 'manage_gallery',
            'manage_audio', 'manage_video', 'manage_notices', 'manage_events',
            'manage_downloads', 'manage_contacts', 'manage_settings', 'manage_users', 'manage_homepage'
          ],
          isActive: true,
          createdAt: '2024-01-01'
        };
      }
    }

    setCurrentUser(matchedUser);
    localStorage.setItem('al_jadid_user', JSON.stringify(matchedUser));
    addActivityLog('লগইন (Login)', matchedUser.name, `${matchedUser.role} হিসেবে সফলভাবে প্রবেশ করেছেন।`);
    return true;
  };

  const logout = () => {
    if (currentUser) {
      addActivityLog('লগআউট (Logout)', currentUser.name, 'সিস্টেম থেকে লগআউট সম্পন্ন হয়েছে।');
    }
    setCurrentUser(null);
    localStorage.removeItem('al_jadid_user');
  };

  return (
    <MadrasaContext.Provider
      value={{
        language,
        setLanguage,
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        data,
        updateData,
        saveDataToServer,
        isSaving,
        login,
        logout,
        currentTrack,
        isPlayingAudio,
        playTrack,
        togglePlayAudio,
        stopAudio,
        isSearchOpen,
        setIsSearchOpen,
        selectedTeacher,
        setSelectedTeacher,
        selectedFounder,
        setSelectedFounder,
        selectedNotice,
        setSelectedNotice,
        selectedVideo,
        setSelectedVideo,
        galleryLightboxIndex,
        setGalleryLightboxIndex,
        submitContactForm,
        submitFounderUpdateProposal,
        approveFounderUpdateProposal,
        rejectFounderUpdateProposal,
        addActivityLog,
        resetToInitialSeed,
        updateUserPermissions,
        updateUserAccount,
        addUserAccount,
        deleteUserAccount
      }}
    >
      {children}
    </MadrasaContext.Provider>
  );
};

export const useMadrasa = () => {
  const context = useContext(MadrasaContext);
  if (!context) {
    throw new Error('useMadrasa must be used within a MadrasaProvider');
  }
  return context;
};
