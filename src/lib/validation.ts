/**
 * Comprehensive Validation Utilities for Madrasa CMS & Public Forms
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  // Strict standard email regex
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(email.trim());
};

export const validateEmail = (email: string, required: boolean = true): ValidationResult => {
  if (!email || !email.trim()) {
    return required
      ? { isValid: false, error: 'ইমেইল ঠিকানা দেওয়া আবশ্যক (Email is required)' }
      : { isValid: true };
  }
  if (!isValidEmail(email)) {
    return { isValid: false, error: 'সঠিক ইমেইল ফরম্যাট লিখুন (Invalid email format, e.g. name@domain.com)' };
  }
  return { isValid: true };
};

export const validateUsername = (username: string): ValidationResult => {
  if (!username || !username.trim()) {
    return { isValid: false, error: 'ইউজারনেম দেওয়া আবশ্যক (Username is required)' };
  }
  const clean = username.trim();
  if (clean.length < 3 || clean.length > 30) {
    return { isValid: false, error: 'ইউজারনেম ৩ থেকে ৩০ অক্ষরের মধ্যে হতে হবে (Must be 3-30 characters)' };
  }
  const regex = /^[a-zA-Z0-9_-]+$/;
  if (!regex.test(clean)) {
    return { isValid: false, error: 'ইউজারনেমে কেবল ইংরেজি বর্ণ, সংখ্যা, আন্ডারস্কোর (_) ও হাইফেন (-) ব্যবহার করা যাবে' };
  }
  return { isValid: true };
};

export const validatePhone = (phone: string, required: boolean = true): ValidationResult => {
  if (!phone || !phone.trim()) {
    return required
      ? { isValid: false, error: 'মোবাইল নম্বর দেওয়া আবশ্যক (Phone number is required)' }
      : { isValid: true };
  }
  const clean = phone.trim().replace(/[\s-]/g, '');
  // Supports Bangladesh mobile (01xxxxxxxxx or +8801xxxxxxxxx) and international format
  const bdRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;
  const intlRegex = /^\+?[0-9]{7,15}$/;

  if (!bdRegex.test(clean) && !intlRegex.test(clean)) {
    return { isValid: false, error: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 018XXXXXXXX)' };
  }
  return { isValid: true };
};

export const validateRequiredText = (text: string | undefined | null, fieldName: string = 'এই তথ্যটি'): ValidationResult => {
  if (!text || !text.trim()) {
    return { isValid: false, error: `${fieldName} পূরণ করা আবশ্যক (Required field)` };
  }
  return { isValid: true };
};

export const validateImageUpload = (
  file: File | { size: number; type: string; name: string },
  maxSizeMB: number = 5
): ValidationResult => {
  if (!file) {
    return { isValid: false, error: 'কোনো ফাইল নির্বাচন করা হয়নি' };
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'শুধুমাত্র JPG, PNG, WebP বা GIF ফরম্যাটের ছবি আপলোড করুন' };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { isValid: false, error: `ছবির সাইজ সর্বোচ্চ ${maxSizeMB}MB এর মধ্যে হতে হবে (বর্তমান সাইজ: ${(file.size / (1024 * 1024)).toFixed(1)}MB)` };
  }

  return { isValid: true };
};

export const validateDocumentUpload = (
  file: File | { size: number; type: string; name: string },
  maxSizeMB: number = 25
): ValidationResult => {
  if (!file) {
    return { isValid: false, error: 'কোনো ফাইল নির্বাচন করা হয়নি' };
  }

  const allowedExtensions = ['.pdf', '.doc', '.docx', '.zip', '.rar', '.xls', '.xlsx'];
  const fileNameLower = file.name.toLowerCase();
  const hasValidExt = allowedExtensions.some(ext => fileNameLower.endsWith(ext));

  if (!hasValidExt) {
    return { isValid: false, error: 'শুধুমাত্র PDF, Word Document বা ZIP ফাইল আপলোড করুন' };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { isValid: false, error: `ফাইলের সাইজ সর্বোচ্চ ${maxSizeMB}MB এর মধ্যে হতে হবে` };
  }

  return { isValid: true };
};

export const validateUrl = (url: string, required: boolean = false): ValidationResult => {
  if (!url || !url.trim()) {
    return required ? { isValid: false, error: 'URL দেওয়া আবশ্যক' } : { isValid: true };
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'URL অবশ্যই http:// অথবা https:// দিয়ে শুরু হতে হবে' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'সঠিক ওয়েব লিংক (URL) প্রদান করুন' };
  }
};
