import { Language, LocalizedString } from '../types';

export const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
export const enDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Converts numbers and digit strings across Bengali, Arabic, and English formats.
 */
export function formatDigits(val: string | number | undefined | null, lang: Language = 'bn'): string {
  if (val === undefined || val === null) return '';
  const str = String(val);
  
  // Normalize all bn and ar digits to ASCII English digits 0-9
  let normalized = str;
  for (let i = 0; i < 10; i++) {
    normalized = normalized.split(bnDigits[i]).join(enDigits[i]);
    normalized = normalized.split(arDigits[i]).join(enDigits[i]);
  }

  if (lang === 'bn') {
    let res = normalized;
    for (let i = 0; i < 10; i++) {
      res = res.split(enDigits[i]).join(bnDigits[i]);
    }
    return res;
  }
  
  if (lang === 'ar') {
    let res = normalized;
    for (let i = 0; i < 10; i++) {
      res = res.split(enDigits[i]).join(arDigits[i]);
    }
    return res;
  }

  // en or default
  return normalized;
}

/**
 * Formats dates (e.g. 2024-01-10 -> ২০২৪-০১-১০ / 2024-01-10 / ٢٠٢٤-٠١-١٠)
 */
export function formatDate(dateStr: string | undefined | null, lang: Language = 'bn'): string {
  if (!dateStr) return '';
  return formatDigits(dateStr, lang);
}

/**
 * Formats time strings (e.g. 04:47 -> ০৪:৪৭ / 04:47 / ٠٤:٤٧)
 */
export function formatTime(timeStr: string | undefined | null, lang: Language = 'bn'): string {
  if (!timeStr) return '';
  return formatDigits(timeStr, lang);
}

/**
 * Standard getLocalized utility
 * In Google Translate mode, the base Bengali string (or available string) is returned,
 * and the Google Translate Website Widget translates the DOM dynamically.
 */
export const getLocalized = (
  field: LocalizedString | string | undefined | null,
  lang: Language = 'bn'
): string => {
  if (!field) return '';
  if (typeof field === 'string') return formatDigits(field, lang);
  const text = field.bn || field.en || field.ar || '';
  return text;
};

export const toLocal = (bn: string, en?: string, ar?: string): LocalizedString => ({
  bn: bn || '',
  en: en || bn || '',
  ar: ar || bn || ''
});

const baseTranslations = {
  // Navigation
  nav_home: 'হোম',
  nav_about: 'পরিচিতি ও ইতিহাস',
  nav_founders: 'প্রতিষ্ঠাতাগণ',
  nav_teachers: 'শিক্ষকমণ্ডলী',
  nav_departments: 'বিভাগ ও কার্যক্রম',
  nav_gallery: 'ফটো গ্যালারি',
  nav_audio: 'অডিও বয়ান ও তিলাওয়াত',
  nav_video: 'ভিডিও গ্যালারি',
  nav_notices: 'বিজ্ঞপ্তি ও নোটিশ',
  nav_events: 'ইভেন্টস ও মাহফিল',
  nav_downloads: 'ডাউনলোড কর্নার',
  nav_contact: 'যোগাযোগ',
  nav_portal: 'লগ ইন',
  nav_search: 'অনুসন্ধান করুন...',

  // Top bar & utility
  top_established: 'স্থাপিত: ১৯৯৮ খ্রি.',
  top_sandwip: 'সন্দ্বীপ, চট্টগ্রাম',
  top_prayer_times: 'আজকের নামাজের সময়সূচি',
  top_fajr: 'ফজর',
  top_dhuhr: 'যোহর',
  top_asr: 'আসর',
  top_maghrib: 'মাগরিব',
  top_isha: 'ইশা',
  top_jummah: 'জুমুআ',
  top_emergency: 'জরুরি বিজ্ঞপ্তি',
  top_quick_contact: 'যোগাযোগ:',
  top_helpline: 'হেল্পলাইন:',

  // Common buttons & actions
  btn_read_more: 'বিস্তারিত পড়ুন',
  btn_view_all: 'সকল দেখুন',
  btn_download: 'ডাউনলোড করুন',
  btn_play_audio: 'অডিও শুনুন',
  btn_watch_video: 'ভিডিও দেখুন',
  btn_contact_us: 'আমাদের সাথে যোগাযোগ করুন',
  btn_admission_form: 'ভর্তি ফরম ডাউনলোড',
  btn_submit: 'জমা দিন',
  btn_save: 'সংরক্ষণ করুন',
  btn_cancel: 'বাতিল',
  btn_edit: 'সম্পাদনা',
  btn_delete: 'মুছে ফেলুন',
  btn_approve: 'অনুমোদন দিন',
  btn_reject: 'প্রত্যাখ্যান করুন',
  btn_search: 'অনুসন্ধান',
  btn_close: 'বন্ধ করুন',
  btn_login: 'লগইন করুন',
  btn_logout: 'লগআউট',
  btn_dashboard: 'ড্যাশবোর্ড',
  btn_back_to_site: 'মূল ওয়েবসাইটে ফিরুন',
  btn_add_new: 'নতুন যুক্ত করুন',
  btn_export_backup: 'ব্যাকআপ ডাউনলোড',
  btn_import_restore: 'রিস্টোর করুন',

  // Hero & Home Section Headings
  hero_bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  hero_sub_greeting: 'ইলমে ওহীর এক নির্ভরযোগ্য ও আদর্শ দ্বীনি শিক্ষাকেন্দ্র',
  hero_cta_admission: 'ভর্তি তথ্য ও ফরম',
  hero_cta_history: 'মাদ্রাসার ইতিহাস',
  hero_stat_students: 'অধ্যয়নরত শিক্ষার্থী',
  hero_stat_hifz: 'হিফজ সম্পন্নকারী',
  hero_stat_teachers: 'যোগ্য শিক্ষকবৃন্দ',
  hero_stat_years: 'বছরের গৌরবোজ্জ্বল পথচলা',

  // Section Titles
  sec_history_title: 'আমাদের সংক্ষিপ্ত ইতিহাস',
  sec_history_subtitle: 'সন্দ্বীপের দ্বীনি শিক্ষার আলোকবর্তিকা',
  sec_founders_title: 'সম্মানিত প্রতিষ্ঠাতাবৃন্দ',
  sec_founders_subtitle: 'যাঁদের ত্যাগ ও সার্বিক পৃষ্ঠপোষকতায় প্রতিষ্ঠিত এই দ্বীনি প্রতিষ্ঠান',
  sec_teachers_title: 'অভিজ্ঞ শিক্ষকমণ্ডলী',
  sec_teachers_subtitle: 'দক্ষ ও চরিত্রবান আলেম গড়ার নিরলস কারিগর',
  sec_departments_title: 'শিক্ষা বিভাগ ও কার্যক্রম',
  sec_departments_subtitle: 'নূরানী থেকে দাওরায়ে হাদিস পর্যন্ত যুগোপযোগী ও মানসম্মত দ্বীনি শিক্ষা',
  sec_notices_title: 'জরুরি বিজ্ঞপ্তি ও নোটিশ বোর্ড',
  sec_notices_subtitle: 'মাদ্রাসার সার্বিক প্রাতিষ্ঠানিক ও শিক্ষামূলক নোটিশসমূহ',
  sec_events_title: 'আসন্ন ও পূর্ববর্তী ইভেন্ট',
  sec_events_subtitle: 'বার্ষিক মাহফিল, দস্তারবন্দী ও সাংস্কৃতিক সম্মেলন',
  sec_gallery_title: 'ফটো গ্যালারি',
  sec_gallery_subtitle: 'মাদ্রাসার মনোরম পরিবেশ ও বিভিন্ন কার্যক্রমের চিত্র',
  sec_audio_title: 'অডিও তিলাওয়াত ও বয়ান',
  sec_audio_subtitle: 'মধুর কুরআন তিলাওয়াত ও শীর্ষ ওলামায়ে কেরামের গুরুত্বপূর্ণ বয়ান',
  sec_video_title: 'ভিডিও সংগ্রহশালা',
  sec_video_subtitle: 'মাদ্রাসার মাহফিল, ওয়াজ ও প্রামাণ্যচিত্র',
  sec_downloads_title: 'ডাউনলোড ও রিসোর্স কর্নার',
  sec_downloads_subtitle: 'প্রয়োজনীয় ফরম, সিলেবাস, ও শিক্ষাসামগ্রী',
  sec_contact_title: 'যোগাযোগ ও অবস্থান',
  sec_contact_subtitle: 'যেকোনো তথ্য ও সহযোগিতার জন্য যোগাযোগ করুন',

  // Audio Player
  audio_now_playing: 'এখন বাজছে:',
  audio_speaker: 'বক্তা / ক্বারী:',
  audio_category: 'ক্যাটাগরি:',
  audio_duration: 'সময়কাল:',
  audio_all_tracks: 'সকল অডিও ট্র্যাক',

  // Notice & Event Details
  notice_published_date: 'প্রকাশের তারিখ:',
  notice_published_by: 'প্রকাশক:',
  notice_urgent_badge: 'জরুরি নোটিশ',
  notice_pinned_badge: 'পিনকৃত',
  notice_view_pdf: 'সংযুক্ত ফাইল দেখুন',
  event_date: 'তারিখ:',
  event_time: 'সময়:',
  event_venue: 'স্থান:',
  event_speakers: 'আমন্ত্রিত মেহমানবৃন্দ:',
  event_upcoming: 'আসন্ন ইভেন্ট',
  event_past: 'সম্পন্ন ইভেন্ট',

  // Contact Form
  contact_form_title: 'বার্তা পাঠান',
  contact_name: 'আপনার নাম',
  contact_email: 'ই-মেইল এড্রেস',
  contact_phone: 'মোবাইল নম্বর',
  contact_subject: 'বিষয়',
  contact_message: 'আপনার বার্তা লিখুন...',
  contact_success: 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। ধন্যবাদ!',
  contact_madrasa_info: 'মাদ্রাসার প্রাতিষ্ঠানিক ঠিকানা',

  // Founder Approval System
  approval_pending_title: 'প্রতিষ্ঠাতা প্রোফাইল পর্যালোচনা ও অনুমোদন',
  approval_founder_submitted: 'প্রতিষ্ঠাতা কর্তৃক প্রেরিত তথ্যের পরিবর্তন',
  approval_original: 'বর্তমান প্রকাশিত তথ্য',
  approval_proposed: 'প্রস্তাবিত নতুন তথ্য',
  approval_action_approve: 'অনুমোদন দিয়ে প্রকাশ করুন',
  approval_action_reject: 'প্রত্যাখ্যান করুন',
  approval_notes_placeholder: 'প্রত্যাখ্যানের কারণ বা মন্তব্য লিখুন...',
  founder_portal_title: 'প্রতিষ্ঠাতা নিজস্ব প্রোফাইল পোর্টাল',
  founder_portal_desc: 'আপনার প্রোফাইলের তথ্য আপডেট করুন। তথ্য সাবমিট করার পর সুপার অ্যাডমিনের অনুমোদনের পর তা ওয়েবসাইটে প্রকাশিত হবে।',
  founder_status_pending: 'আপনার সর্বশেষ আপডেট সুপার অ্যাডমিনের অনুমোদনের অপেক্ষায় রয়েছে।',
  founder_status_approved: 'আপনার প্রোফাইল অনুমোদিত ও প্রকাশিত অবস্থায় আছে।',

  // Admin CMS
  admin_dashboard: 'অ্যাডমিন কন্ট্রোল ড্যাশবোর্ড',
  admin_overview: 'সার্বিক পরিসংখ্যান',
  admin_manage_teachers: 'শিক্ষক ব্যবস্থাপনা',
  admin_manage_founders: 'প্রতিষ্ঠাতা ব্যবস্থাপনা',
  admin_manage_history: 'ইতিহাস ও মাইলফলক',
  admin_manage_gallery: 'ফটো গ্যালারি',
  admin_manage_audio: 'অডিও লাইব্রেরি',
  admin_manage_video: 'ভিডিও লাইব্রেরি',
  admin_manage_notices: 'বিজ্ঞপ্তি ও নোটিশ',
  admin_manage_events: 'ইভেন্ট ও মাহফিল',
  admin_manage_downloads: 'ডাউনলোড ফাইল',
  admin_manage_contacts: 'যোগাযোগের ইনবক্স',
  admin_manage_settings: 'সাইট সেটিংস ও তথ্য',
  admin_manage_users: 'ইউজার ও রোল পারমিশন',
  admin_homepage_config: 'হোমপেজ সেকশন কনফিগ',
  admin_activity_log: 'অ্যাক্টিভিটি লগ',
  admin_backup_restore: 'ব্যাকআপ ও রিস্টোর',

  // Roles
  role_super_admin: 'সুপার অ্যাডমিন (Super Admin)',
  role_admin: 'অ্যাডমিন (Admin)',
  role_founder: 'প্রতিষ্ঠাতা ইউজার (Founder)',
  role_visitor: 'ভিজিটর (Visitor)',

  // Footer
  footer_quick_links: 'দ্রুত লিংক',
  footer_departments: 'শিক্ষা বিভাগসমূহ',
  footer_about: 'মাদ্রাসা পরিচিতি',
  footer_rights: 'সর্বস্বত্ব সংরক্ষিত।',
  footer_designed_for: 'ডাঃ আহমেদ উল্ল্যা-ছালেহা আল-জাদিদ মাদ্রাসা, সন্দ্বীপ, চট্টগ্রাম।',

  // Search Modal
  search_heading: 'শিক্ষক, প্রতিষ্ঠাতা, নোটিশ, ওয়াজ, বয়ান বা যেকোনো তথ্য অনুসন্ধান করুন',
  search_examples_label: 'উদাহরণ:',
  search_clear: 'মুছুন',
  search_no_results: 'সম্পর্কিত কোনো তথ্য পাওয়া যায়নি',
  search_try_different: 'ভিন্ন শব্দ দিয়ে আবার চেষ্টা করুন।',
  search_results_teachers: 'শিক্ষকমণ্ডলী',
  search_results_founders: 'প্রতিষ্ঠাতাবৃন্দ',
  search_results_notices: 'নোটিশ ও বিজ্ঞপ্তি',
  search_results_events: 'ইভেন্ট ও মাহফিল',
  search_results_audio: 'অডিও তিলাওয়াত ও বয়ান',
  search_results_videos: 'ভিডিও সংগ্রহশালা',
  search_results_downloads: 'ডাউনলোড ফাইল',

  // Contact View & Donation
  contact_banner_title: 'যোগাযোগ ও অনুদান সংক্রান্ত তথ্য',
  contact_banner_subtitle: 'মাদ্রাসার প্রশাসনিক কার্যালয়ে সরাসরি উপস্থিত হতে পারেন অথবা ফোন ও বার্তার মাধ্যমে যোগাযোগ করতে পারেন।',
  contact_hq_title: 'প্রধান কার্যালয় ও ঠিকানা',
  contact_location_label: 'মাদ্রাসার অবস্থান:',
  contact_hotline_label: 'অফিসিয়াল হটলাইন:',
  contact_email_label: 'ইমেইল ঠিকানা:',
  contact_whatsapp_btn: 'হোয়াটসঅ্যাপে সরাসরি চ্যাট করুন',
  contact_donation_title: 'লিল্লাহ বোর্ডিং ও যাকাত ফান্ড অনুদান',
  contact_donation_desc: 'মাদ্রাসার এতিম ও অসচ্ছল শিক্ষার্থীদের খাবার, কিতাব ও আবাসনের জন্য আপনার যাকাত ও সদকা প্রদান করতে পারেন:',
  contact_bank_name_label: 'ব্যাংক:',
  contact_bank_name_val: 'ইসলামী ব্যাংক বাংলাদেশ লিঃ',
  contact_acc_name_label: 'হিসাবের নাম:',
  contact_acc_no_label: 'হিসাব নম্বর:',
  contact_bkash_label: 'বিকাশ/নগদ (মার্চেন্ট):',
  contact_form_heading: 'আমাদের সরাসরি বার্তা পাঠান',
  contact_form_sub: 'ভর্তি, অনুসন্ধান বা যেকোনো পরামর্শের জন্য নিচের ফরমটি পূরণ করুন। আমরা শীঘ্রই যোগাযোগ করব।',
  contact_msg_sent_title: 'আপনার বার্তা সফলভাবে গ্রহণ করা হয়েছে!',
  contact_msg_sent_sub: 'জাজাকাল্লাহু খাইরান। আমাদের মাদ্রাসার সংশ্লিষ্ট প্রতিনিধি শীঘ্রই আপনার মোবাইল নম্বরে যোগাযোগ করবেন।',
  contact_send_another: 'আরেকটি বার্তা পাঠান',
  contact_full_name: 'আপনার পূর্ণ নাম',
  contact_name_placeholder: 'যেমন: মুহাম্মদ আবদুল্লাহ',
  contact_phone_placeholder: '০১XXXXXXXXX',
  contact_email_optional: 'ইমেইল (ঐচ্ছিক)',
  contact_subject_label: 'বিষয় / অনুসন্ধানের ধরন',
  contact_subject_select: 'বিষয় নির্বাচন করুন',
  contact_subj_admission: 'ভর্তি সংক্রান্ত অনুসন্ধান',
  contact_subj_lillah: 'লিল্লাহ বোর্ডিং ও যাকাত অনুদান',
  contact_subj_mahfil: 'মাহফিল ও ইসলামী সম্মেলন',
  contact_subj_general: 'অন্যান্য সাধারণ পরামর্শ',
  contact_msg_label: 'আপনার বার্তা / প্রশ্ন',
  contact_msg_placeholder: 'বিস্তারিত বার্তা এখানে লিখুন...',
  contact_btn_send: 'বার্তা প্রেরণ করুন',
  contact_map_heading: 'গুগল ম্যাপে মাদ্রাসার লোকেশন',

  // Modals
  modal_qualifications: 'শিক্ষাগত যোগ্যতা ও সনদ',
  modal_experience: 'অভিজ্ঞতা',
  modal_joining_year: 'যোগদানের সন',
  modal_bio_intro: 'সংক্ষিপ্ত পরিচিতি ও ভূমিকা',
  modal_founder_since: 'প্রতিষ্ঠাতা হিসেবে সম্পৃক্ততা:',
  modal_founder_contribution: 'মাদ্রাসায় অবদান ও ঐতিহাসিক ভূমিকা',
  modal_founder_bio: 'জীবনবৃত্তান্ত ও দর্শন',
  modal_founder_edu_prof: 'শিক্ষাগত ও পেশাগত পরিচয়',
  modal_video_presenter: 'উপস্থাপনা / বক্তা:',
  modal_notice_pdf_desc: 'অফিসিয়াল নোটিশ ডকুমেন্ট (PDF)'
};

// Proxied translations object that responds with base string for all language keys
export const translations: Record<Language, typeof baseTranslations> = {
  bn: baseTranslations,
  en: baseTranslations,
  ar: baseTranslations
};
