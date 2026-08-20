import { UserAccount, AdminPermission, MadrasaDatabase } from '../types';

/**
 * Sanitize plain text strings to prevent injection
 */
export function sanitizeText(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

/**
 * Sanitize URLs to prevent javascript: and data: text/html attacks
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  // Allow safe protocols and data URLs for images, audio, pdfs
  const safeProtocols = [
    'http:', 'https:', 'mailto:', 'tel:',
    'data:image/', 'data:audio/', 'data:application/pdf'
  ];

  const isSafe = safeProtocols.some(proto => trimmed.toLowerCase().startsWith(proto)) || trimmed.startsWith('/');
  if (!isSafe && trimmed.length > 0) {
    // If it starts with javascript: or vbscript:, reject
    if (/^(javascript|vbscript|data:text\/html):/i.test(trimmed)) {
      return '#';
    }
  }
  return trimmed;
}

/**
 * Check if the user has permission for a specific module
 */
export function hasPermission(
  user: UserAccount | null | undefined,
  requiredPermission: AdminPermission
): boolean {
  if (!user || !user.isActive) return false;
  if (user.role === 'super_admin') return true;
  if (user.role === 'admin') {
    return Array.isArray(user.permissions) && user.permissions.includes(requiredPermission);
  }
  return false;
}

/**
 * Format bytes to readable size
 */
export function formatBytes(bytes: number, lang: 'bn' | 'en' | 'ar' = 'bn'): string {
  if (bytes === 0) return lang === 'bn' ? '০ KB' : '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  
  if (lang === 'bn') {
    const toBengaliNumber = (num: number | string) => {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return String(num).replace(/[0-9]/g, d => bnDigits[Number(d)] || d);
    };
    return `${toBengaliNumber(val)} ${sizes[i]}`;
  }
  
  return `${val} ${sizes[i]}`;
}

/**
 * Validate imported database backup to ensure data integrity
 */
export function validateDatabaseSchema(data: any): { valid: boolean; error?: string; validatedData?: MadrasaDatabase } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'অবৈধ ফাইল ফরম্যাট: ব্যাকআপ ফাইলটি একটি সঠিক JSON অবজেক্ট হতে হবে।' };
  }

  // Required root collections
  const requiredArrays = ['teachers', 'founders', 'gallery', 'audio', 'videos', 'notices', 'events', 'downloads', 'users'];
  for (const field of requiredArrays) {
    if (!Array.isArray(data[field])) {
      return { valid: false, error: `ডেটাবেজ ত্রুটি: '${field}' অ্যারে ব্যাকআপ ফাইলে পাওয়া যায়নি বা ক্ষতিগ্রস্ত।` };
    }
  }

  if (!data.settings || typeof data.settings !== 'object') {
    return { valid: false, error: "ডেটাবেজ ত্রুটি: 'settings' অবজেক্ট ব্যাকআপ ফাইলে অনুপস্থিত।" };
  }

  if (!data.history || typeof data.history !== 'object') {
    return { valid: false, error: "ডেটাবেজ ত্রুটি: 'history' অবজেক্ট ব্যাকআপ ফাইলে অনুপস্থিত।" };
  }

  // Ensure arrays exist even if optional
  const cleanData: MadrasaDatabase = {
    ...data,
    contacts: Array.isArray(data.contacts) ? data.contacts : [],
    activityLogs: Array.isArray(data.activityLogs) ? data.activityLogs : [],
    departments: Array.isArray(data.departments) ? data.departments : []
  };

  return { valid: true, validatedData: cleanData };
}

/**
 * Calculate password strength score (0-4)
 */
export function evaluatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: 'পাসওয়ার্ড দিন', color: 'text-slate-400' };
  
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 1:
      return { score: 1, label: 'খুব দুর্বল (Weak)', color: 'text-red-500' };
    case 2:
      return { score: 2, label: 'সাধারণ (Fair)', color: 'text-amber-500' };
    case 3:
      return { score: 3, label: 'ভালো (Good)', color: 'text-blue-500' };
    case 4:
      return { score: 4, label: 'অত্যন্ত শক্তিশালী (Strong)', color: 'text-emerald-600' };
    default:
      return { score: 0, label: 'খুব ছোট', color: 'text-slate-400' };
  }
}
