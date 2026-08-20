export type Language = 'bn' | 'en' | 'ar';

export interface LocalizedString {
  bn: string;
  en: string;
  ar: string;
}

export type UserRole = 'super_admin' | 'admin' | 'founder' | 'visitor';

export type AdminPermission =
  | 'manage_teachers'
  | 'manage_founders'
  | 'manage_history'
  | 'manage_gallery'
  | 'manage_audio'
  | 'manage_video'
  | 'manage_notices'
  | 'manage_events'
  | 'manage_downloads'
  | 'manage_contacts'
  | 'manage_settings'
  | 'manage_users'
  | 'manage_homepage';

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: AdminPermission[];
  password?: string;
  linkedFounderId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah: string;
}

export interface SocialLinks {
  facebook: string;
  youtube: string;
  whatsapp: string;
  telegram?: string;
  twitter?: string;
}

export interface HomepageSectionConfig {
  id: string;
  key: string;
  title: LocalizedString;
  enabled: boolean;
  order: number;
}

export interface InstitutionSettings {
  name: LocalizedString;
  shortName: LocalizedString;
  slogan: LocalizedString;
  establishedYear: string;
  address: LocalizedString;
  district: LocalizedString;
  upazila: LocalizedString;
  phone: string;
  secondaryPhone?: string;
  email: string;
  googleMapsEmbedUrl: string;
  socialLinks: SocialLinks;
  prayerTimes: PrayerTimes;
  emergencyNotice?: {
    enabled: boolean;
    text: LocalizedString;
    link?: string;
  };
  seo: {
    metaTitle: LocalizedString;
    metaDescription: LocalizedString;
    keywords: string;
  };
  homepageSections: HomepageSectionConfig[];
}

export interface Teacher {
  id: string;
  name: LocalizedString;
  designation: LocalizedString;
  department: LocalizedString;
  image: string;
  subject: LocalizedString;
  qualifications: LocalizedString;
  experience: LocalizedString;
  biography: LocalizedString;
  address: LocalizedString;
  joiningDate: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  order: number;
}

export interface Founder {
  id: string;
  name: LocalizedString;
  designation: LocalizedString;
  image: string;
  address: LocalizedString;
  about: LocalizedString;
  biography: LocalizedString;
  historyContribution: LocalizedString;
  educationalBackground?: LocalizedString;
  professionalBackground?: LocalizedString;
  founderSince: string;
  phone?: string;
  email?: string;
  socialLinks?: Partial<SocialLinks>;
  isApproved: boolean;
  pendingUpdate?: Partial<Founder>;
  updateSubmittedAt?: string;
  reviewerNotes?: string;
  linkedUserId?: string;
  order: number;
}

export interface HistoryMilestone {
  id: string;
  year: string;
  title: LocalizedString;
  description: LocalizedString;
  image?: string;
  order: number;
}

export interface HistoryContent {
  mainTitle: LocalizedString;
  introduction: LocalizedString;
  purposeOfEstablishment: LocalizedString;
  backgroundStory: LocalizedString;
  majorAchievements: LocalizedString[];
  milestones: HistoryMilestone[];
}

export interface GalleryItem {
  id: string;
  title: LocalizedString;
  category: 'campus' | 'teachers' | 'founders' | 'events' | 'students' | 'programs' | 'religious';
  imageUrl: string;
  description?: LocalizedString;
  date: string;
  isFeatured: boolean;
  order: number;
}

export interface AudioTrack {
  id: string;
  title: LocalizedString;
  category: 'waz' | 'quran' | 'nasheed' | 'lectures' | 'programs';
  speaker: LocalizedString;
  audioUrl: string;
  duration: string;
  description?: LocalizedString;
  date: string;
  isPublished: boolean;
  playCount: number;
}

export interface VideoItem {
  id: string;
  title: LocalizedString;
  category: 'waz' | 'lectures' | 'programs' | 'events' | 'documentary';
  presenter: LocalizedString;
  videoUrl: string; // YouTube or direct embed
  thumbnailUrl: string;
  description?: LocalizedString;
  date: string;
  isPublished: boolean;
}

export interface Notice {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  category: 'general' | 'admission' | 'exam' | 'event' | 'urgent';
  date: string;
  expiryDate?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  isPinned: boolean;
  isPublished: boolean;
  publishedBy: LocalizedString;
}

export interface EventItem {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  date: string;
  time: string;
  location: LocalizedString;
  image: string;
  isUpcoming: boolean;
  isPublished: boolean;
  guestSpeakers?: LocalizedString[];
}

export interface DownloadItem {
  id: string;
  title: LocalizedString;
  category: 'admission' | 'academic' | 'prospectus' | 'rules' | 'forms' | 'results';
  fileUrl: string;
  fileSize: string;
  fileType: 'pdf' | 'doc' | 'image' | 'zip';
  date: string;
  downloadCount: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
  replyStatus: 'pending' | 'replied' | 'archived';
  adminNotes?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  target: string;
  details: string;
}

export interface Department {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  duration: LocalizedString;
  features: LocalizedString[];
  icon: string;
  image: string;
}

export interface MadrasaDatabase {
  settings: InstitutionSettings;
  teachers: Teacher[];
  founders: Founder[];
  history: HistoryContent;
  gallery: GalleryItem[];
  audio: AudioTrack[];
  videos: VideoItem[];
  notices: Notice[];
  events: EventItem[];
  downloads: DownloadItem[];
  contacts: ContactMessage[];
  users: UserAccount[];
  activityLogs: ActivityLog[];
  departments: Department[];
}
