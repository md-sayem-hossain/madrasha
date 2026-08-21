-- =====================================================================
-- DATABASE: madrasa_db
-- APPLICATION: Dr. Ahmed Ullah-Saleha Al-Jadid Madrasa (Official Web & CMS)
-- CHARACTER SET: utf8mb4 (Full Bengali, Arabic, and English UTF-8 support)
-- COLLATION: utf8mb4_unicode_ci
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `madrasa_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `madrasa_db`;

-- ---------------------------------------------------------------------
-- 1. Table: `institution_settings`
-- Stores institution branding, address, prayer times, stats, and configurations
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `institution_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name_bn` VARCHAR(255) NOT NULL DEFAULT 'ডাঃ আহমেদ উল্ল্যা-ছালেহা আল-জাদিদ মাদ্রাসা',
  `name_en` VARCHAR(255) NOT NULL DEFAULT 'Dr. Ahmed Ullah-Saleha Al-Jadid Madrasa',
  `name_ar` VARCHAR(255) NOT NULL DEFAULT 'مدرسة الدكتور أحمد الله صالحة الجديد',
  `short_name_bn` VARCHAR(100) DEFAULT 'আল-জাদিদ মাদ্রাসা',
  `short_name_en` VARCHAR(100) DEFAULT 'Al-Jadid Madrasa',
  `short_name_ar` VARCHAR(100) DEFAULT 'مدرسة الجديد',
  `slogan_bn` TEXT DEFAULT 'ইলমে ওহীর এক নির্ভরযোগ্য ও আদর্শ দ্বীনি শিক্ষাকেন্দ্র',
  `slogan_en` TEXT DEFAULT 'A Trusted Center of Higher Moral & Quranic Guidance',
  `slogan_ar` TEXT DEFAULT 'صرح إسلامي متميز لتعليم علوم الوحي والتربية النبوية',
  `established_year` VARCHAR(10) DEFAULT '1998',
  `address_bn` TEXT DEFAULT 'কুড়িয়ামৌড়া, সন্দ্বীপ, চট্টগ্রাম, বাংলাদেশ',
  `address_en` TEXT DEFAULT 'Kuriamoura, Sandwip, Chittagong, Bangladesh',
  `address_ar` TEXT DEFAULT 'كوريا مورا، ساندويب، شيتاغونغ، بنغلاديش',
  `district_bn` VARCHAR(100) DEFAULT 'চট্টগ্রাম',
  `district_en` VARCHAR(100) DEFAULT 'Chittagong',
  `district_ar` VARCHAR(100) DEFAULT 'شيتاغونغ',
  `upazila_bn` VARCHAR(100) DEFAULT 'সন্দ্বীপ',
  `upazila_en` VARCHAR(100) DEFAULT 'Sandwip',
  `upazila_ar` VARCHAR(100) DEFAULT 'ساندويب',
  `phone` VARCHAR(50) DEFAULT '018XXXXXXXX',
  `secondary_phone` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT 'info@aljadidmadrasa.edu.bd',
  `google_maps_url` TEXT DEFAULT NULL,
  `facebook_url` VARCHAR(255) DEFAULT 'https://facebook.com',
  `youtube_url` VARCHAR(255) DEFAULT 'https://youtube.com',
  `whatsapp_number` VARCHAR(50) DEFAULT '018XXXXXXXX',
  -- Prayer times schedule
  `fajr_time` VARCHAR(20) DEFAULT '04:47 AM',
  `dhuhr_time` VARCHAR(20) DEFAULT '12:06 PM',
  `asr_time` VARCHAR(20) DEFAULT '04:38 PM',
  `maghrib_time` VARCHAR(20) DEFAULT '06:25 PM',
  `isha_time` VARCHAR(20) DEFAULT '07:44 PM',
  `jummah_time` VARCHAR(20) DEFAULT '01:15 PM',
  -- Institutional key statistics
  `stats_total_students` VARCHAR(20) DEFAULT '350',
  `stats_total_teachers` VARCHAR(20) DEFAULT '18',
  `stats_total_hafiz` VARCHAR(20) DEFAULT '120',
  `stats_established_year` VARCHAR(20) DEFAULT '1998',
  -- Emergency notice banner configuration
  `emergency_notice_enabled` TINYINT(1) DEFAULT 0,
  `emergency_notice_bn` TEXT DEFAULT NULL,
  `emergency_notice_en` TEXT DEFAULT NULL,
  `emergency_notice_ar` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Table: `users`
-- Admin accounts, roles (super_admin, admin, founder), and permissions
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `username` VARCHAR(100) UNIQUE NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'admin', 'founder', 'visitor') DEFAULT 'admin',
  `permissions` JSON DEFAULT NULL,
  `linked_founder_id` VARCHAR(64) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Table: `founders`
-- Madrasa founders, lifetime donors, patrons, and profile updates
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `founders` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name_bn` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NOT NULL,
  `name_ar` VARCHAR(255) NOT NULL,
  `designation_bn` VARCHAR(255) NOT NULL,
  `designation_en` VARCHAR(255) NOT NULL,
  `designation_ar` VARCHAR(255) NOT NULL,
  `image` TEXT NOT NULL,
  `address_bn` TEXT DEFAULT NULL,
  `address_en` TEXT DEFAULT NULL,
  `address_ar` TEXT DEFAULT NULL,
  `about_bn` TEXT DEFAULT NULL,
  `about_en` TEXT DEFAULT NULL,
  `about_ar` TEXT DEFAULT NULL,
  `biography_bn` LONGTEXT DEFAULT NULL,
  `biography_en` LONGTEXT DEFAULT NULL,
  `biography_ar` LONGTEXT DEFAULT NULL,
  `history_contribution_bn` LONGTEXT DEFAULT NULL,
  `history_contribution_en` LONGTEXT DEFAULT NULL,
  `history_contribution_ar` LONGTEXT DEFAULT NULL,
  `educational_background_bn` TEXT DEFAULT NULL,
  `educational_background_en` TEXT DEFAULT NULL,
  `educational_background_ar` TEXT DEFAULT NULL,
  `professional_background_bn` TEXT DEFAULT NULL,
  `professional_background_en` TEXT DEFAULT NULL,
  `professional_background_ar` TEXT DEFAULT NULL,
  `founder_since` VARCHAR(50) DEFAULT '1998',
  `phone` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `facebook_url` VARCHAR(255) DEFAULT NULL,
  `is_approved` TINYINT(1) DEFAULT 1,
  `pending_update` JSON DEFAULT NULL,
  `reviewer_notes` TEXT DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_founders_approved` (`is_approved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Table: `teachers`
-- Faculty members, designations, qualifications, and biography
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `teachers` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name_bn` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NOT NULL,
  `name_ar` VARCHAR(255) NOT NULL,
  `designation_bn` VARCHAR(255) NOT NULL,
  `designation_en` VARCHAR(255) NOT NULL,
  `designation_ar` VARCHAR(255) NOT NULL,
  `department_bn` VARCHAR(255) NOT NULL,
  `department_en` VARCHAR(255) NOT NULL,
  `department_ar` VARCHAR(255) NOT NULL,
  `subject_bn` VARCHAR(255) NOT NULL,
  `subject_en` VARCHAR(255) NOT NULL,
  `subject_ar` VARCHAR(255) NOT NULL,
  `qualifications_bn` TEXT NOT NULL,
  `qualifications_en` TEXT NOT NULL,
  `qualifications_ar` TEXT NOT NULL,
  `experience_bn` VARCHAR(100) DEFAULT NULL,
  `experience_en` VARCHAR(100) DEFAULT NULL,
  `experience_ar` VARCHAR(100) DEFAULT NULL,
  `biography_bn` TEXT DEFAULT NULL,
  `biography_en` TEXT DEFAULT NULL,
  `biography_ar` TEXT DEFAULT NULL,
  `address_bn` TEXT DEFAULT NULL,
  `address_en` TEXT DEFAULT NULL,
  `address_ar` TEXT DEFAULT NULL,
  `joining_date` VARCHAR(50) DEFAULT NULL,
  `image` TEXT NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_teachers_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. Table: `departments`
-- Academic curriculum, courses, and educational divisions
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `departments` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name_bn` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NOT NULL,
  `name_ar` VARCHAR(255) NOT NULL,
  `description_bn` TEXT NOT NULL,
  `description_en` TEXT NOT NULL,
  `description_ar` TEXT NOT NULL,
  `duration_bn` VARCHAR(100) DEFAULT NULL,
  `duration_en` VARCHAR(100) DEFAULT NULL,
  `duration_ar` VARCHAR(100) DEFAULT NULL,
  `features_json` JSON DEFAULT NULL,
  `icon` VARCHAR(100) DEFAULT 'BookOpen',
  `image` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. Table: `notices`
-- Institutional circulars, admission notices, and exam updates
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notices` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title_bn` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `description_bn` LONGTEXT NOT NULL,
  `description_en` LONGTEXT NOT NULL,
  `description_ar` LONGTEXT NOT NULL,
  `category` ENUM('general', 'admission', 'exam', 'holiday', 'urgent') DEFAULT 'general',
  `published_date` DATE NOT NULL,
  `expiry_date` DATE DEFAULT NULL,
  `attachment_url` TEXT DEFAULT NULL,
  `attachment_name` VARCHAR(255) DEFAULT NULL,
  `is_pinned` TINYINT(1) DEFAULT 0,
  `is_published` TINYINT(1) DEFAULT 1,
  `published_by_bn` VARCHAR(255) DEFAULT 'মাদ্রাসা প্রশাসন',
  `published_by_en` VARCHAR(255) DEFAULT 'Madrasa Administration',
  `published_by_ar` VARCHAR(255) DEFAULT 'إدارة المدرسة',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_notices_published` (`is_published`, `published_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. Table: `events`
-- Annual Mahfils, Conferences, Competitions & Ceremonies
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `events` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title_bn` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `description_bn` LONGTEXT NOT NULL,
  `description_en` LONGTEXT NOT NULL,
  `description_ar` LONGTEXT NOT NULL,
  `event_date` DATE NOT NULL,
  `event_time` VARCHAR(100) DEFAULT NULL,
  `location_bn` VARCHAR(255) NOT NULL,
  `location_en` VARCHAR(255) NOT NULL,
  `location_ar` VARCHAR(255) NOT NULL,
  `image` TEXT NOT NULL,
  `is_upcoming` TINYINT(1) DEFAULT 1,
  `is_published` TINYINT(1) DEFAULT 1,
  `guest_speakers_json` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. Table: `gallery`
-- High quality campus, event, and activity photos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title_bn` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `category` ENUM('campus', 'teachers', 'founders', 'events', 'students', 'programs', 'religious') DEFAULT 'campus',
  `image_url` TEXT NOT NULL,
  `description_bn` TEXT DEFAULT NULL,
  `description_en` TEXT DEFAULT NULL,
  `description_ar` TEXT DEFAULT NULL,
  `date` DATE NOT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. Table: `audio_tracks`
-- Audio Waz, Quran Tilawat, and Nasheed
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audio_tracks` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title_bn` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `category` ENUM('waz', 'quran', 'nasheed', 'lectures', 'programs') DEFAULT 'waz',
  `speaker_bn` VARCHAR(255) NOT NULL,
  `speaker_en` VARCHAR(255) NOT NULL,
  `speaker_ar` VARCHAR(255) NOT NULL,
  `audio_url` TEXT NOT NULL,
  `duration` VARCHAR(50) DEFAULT '15:00',
  `description_bn` TEXT DEFAULT NULL,
  `description_en` TEXT DEFAULT NULL,
  `description_ar` TEXT DEFAULT NULL,
  `date` DATE NOT NULL,
  `is_published` TINYINT(1) DEFAULT 1,
  `play_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 10. Table: `videos`
-- Video Waz, Islamic Documentaries, and Events
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `videos` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title_bn` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `category` ENUM('waz', 'lectures', 'programs', 'events', 'documentary') DEFAULT 'waz',
  `presenter_bn` VARCHAR(255) NOT NULL,
  `presenter_en` VARCHAR(255) NOT NULL,
  `presenter_ar` VARCHAR(255) NOT NULL,
  `video_url` TEXT NOT NULL,
  `thumbnail_url` TEXT NOT NULL,
  `description_bn` TEXT DEFAULT NULL,
  `description_en` TEXT DEFAULT NULL,
  `description_ar` TEXT DEFAULT NULL,
  `date` DATE NOT NULL,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 11. Table: `downloads`
-- Admission forms, Syllabi, Prospectuses & Certificates
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `downloads` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title_bn` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `description_bn` TEXT DEFAULT NULL,
  `description_en` TEXT DEFAULT NULL,
  `description_ar` TEXT DEFAULT NULL,
  `category` ENUM('admission', 'academic', 'prospectus', 'rules', 'forms', 'results') DEFAULT 'admission',
  `file_url` TEXT NOT NULL,
  `file_size` VARCHAR(50) DEFAULT '1.2 MB',
  `file_type` ENUM('pdf', 'doc', 'image', 'zip') DEFAULT 'pdf',
  `upload_date` DATE NOT NULL,
  `download_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 12. Table: `contacts`
-- Inquiries, Messages, and Admission Requests from Visitors
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` LONGTEXT NOT NULL,
  `date` DATE NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `reply_status` ENUM('pending', 'replied', 'archived') DEFAULT 'pending',
  `admin_notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 13. Table: `history_milestones`
-- Historical milestones of the madrasa establishment
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `history_milestones` (
  `id` VARCHAR(64) PRIMARY KEY,
  `year` VARCHAR(50) NOT NULL,
  `title_bn` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `description_bn` TEXT NOT NULL,
  `description_en` TEXT NOT NULL,
  `description_ar` TEXT NOT NULL,
  `image` TEXT DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 14. Table: `activity_logs`
-- Audit trail of administrative and security actions
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` VARCHAR(64) PRIMARY KEY,
  `timestamp` VARCHAR(100) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `user_role` VARCHAR(50) NOT NULL,
  `action` VARCHAR(255) NOT NULL,
  `target` VARCHAR(255) NOT NULL,
  `details` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_logs_timestamp` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- INITIAL SEED DATA
-- ---------------------------------------------------------------------

-- Insert Default Institution Settings
INSERT INTO `institution_settings` (
  `id`, `name_bn`, `name_en`, `name_ar`, `short_name_bn`, `short_name_en`, `short_name_ar`,
  `slogan_bn`, `slogan_en`, `slogan_ar`, `established_year`,
  `address_bn`, `address_en`, `address_ar`, `phone`, `email`,
  `fajr_time`, `dhuhr_time`, `asr_time`, `maghrib_time`, `isha_time`, `jummah_time`,
  `stats_total_students`, `stats_total_teachers`, `stats_total_hafiz`, `stats_established_year`
) VALUES (
  1,
  'ডাঃ আহমেদ উল্ল্যা-ছালেহা আল-জাদিদ মাদ্রাসা',
  'Dr. Ahmed Ullah-Saleha Al-Jadid Madrasa',
  'مدرسة الدكتور أحمد الله صالحة الجديد',
  'আল-জাদিদ মাদ্রাসা',
  'Al-Jadid Madrasa',
  'مدرسة الجديد',
  'ইলমে ওহীর এক নির্ভরযোগ্য ও আদর্শ দ্বীনি শিক্ষাকেন্দ্র',
  'A Trusted Center of Higher Moral & Quranic Guidance',
  'صرح إسلامي متميز لتعليم علوم الوحي والتربية النبوية',
  '1998',
  'কুড়িয়ামৌড়া, সন্দ্বীপ, চট্টগ্রাম, বাংলাদেশ',
  'Kuriamoura, Sandwip, Chittagong, Bangladesh',
  'كوريا مورا، ساندويب، شيتاغونغ، بنغلاديش',
  '০১৮XXXXXXXX',
  'info@aljadidmadrasa.edu.bd',
  '04:47 AM', '12:06 PM', '04:38 PM', '06:25 PM', '07:44 PM', '01:15 PM',
  '350', '18', '120', '1998'
) ON DUPLICATE KEY UPDATE `name_bn` = VALUES(`name_bn`);

-- Insert Default Super Admin, Admin, and Founder User Accounts
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password_hash`, `role`, `permissions`, `is_active`) VALUES
('usr-1', 'মুফতী মাওলানা মোহাম্মদ', 'superadmin', 'superadmin@madrasa.edu.bd', '$2b$10$YourHashedSecretPasswordHere123', 'super_admin', '["manage_teachers", "manage_founders", "manage_history", "manage_gallery", "manage_audio", "manage_video", "manage_notices", "manage_events", "manage_downloads", "manage_contacts", "manage_settings", "manage_users", "manage_homepage"]', 1),
('usr-2', 'মিডিয়া ও কন্টেন্ট অ্যাডমিন', 'admin_media', 'admin@madrasa.edu.bd', '$2b$10$YourHashedSecretPasswordHere123', 'admin', '["manage_gallery", "manage_audio", "manage_video", "manage_notices", "manage_events", "manage_downloads"]', 1),
('usr-3', 'ডাঃ আহমেদ উল্ল্যা (প্রতিষ্ঠাতা)', 'founder_ahmed', 'founder@madrasa.edu.bd', '$2b$10$YourHashedSecretPasswordHere123', 'founder', '[]', 1)
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`);
