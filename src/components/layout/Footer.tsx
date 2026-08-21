import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Youtube,
  MessageCircle,
  ExternalLink,
  Shield,
  Clock,
  Heart
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { translations, getLocalized, formatDigits } from '../../lib/translations';

export const Footer: React.FC = () => {
  const { language, data, setActiveTab } = useMadrasa();
  const t = translations[language];
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (tabKey: string) => {
    setActiveTab(tabKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="site-footer" className="bg-[#1a2e1a] text-emerald-100 border-t-4 border-[#d4af37]">
      {/* Top Banner / Slogan */}
      <div className="bg-[#0a4d28]/70 border-b border-[#0a4d28] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/20 border-2 border-[#d4af37] text-[#d4af37] flex items-center justify-center text-2xl font-serif font-bold shadow-inner flex-shrink-0 notranslate" translate="no">
              <div className="text-center notranslate" translate="no">
                <span className="block text-[10px] text-[#d4af37] leading-tight font-arabic notranslate" translate="no">الجديد</span>
                <span className="block text-2xl leading-none notranslate" translate="no">م</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {getLocalized(data.settings.name, language)}
              </h2>
              <p className="text-sm text-emerald-200 mt-0.5">
                {getLocalized(data.settings.slogan, language)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="footer-admission-btn"
              onClick={() => handleLinkClick('downloads')}
              className="px-5 py-2.5 rounded-lg bg-[#d4af37] hover:bg-[#c49f27] text-[#0a4d28] font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
            >
              {t.btn_admission_form}
            </button>
            <button
              id="footer-contact-btn"
              onClick={() => handleLinkClick('contact')}
              className="px-5 py-2.5 rounded-lg bg-[#1a2e1a] hover:bg-[#152515] text-white font-semibold text-sm border border-[#d4af37]/40 transition-all"
            >
              {t.btn_contact_us}
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: About & Location */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-[#0a4d28] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              {t.footer_about}
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
              {getLocalized(data.history.introduction, language)}
            </p>
            <div className="space-y-2.5 text-xs text-emerald-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <span>{getLocalized(data.settings.address, language)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <a href={`tel:${data.settings.phone}`} className="hover:text-[#d4af37]">
                  {data.settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <a href={`mailto:${data.settings.email}`} className="hover:text-[#d4af37]">
                  {data.settings.email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-[#0a4d28] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              {t.footer_quick_links}
            </h3>
            <ul className="space-y-2 text-xs text-emerald-200">
              <li>
                <button onClick={() => handleLinkClick('home')} className="hover:text-[#d4af37] transition-colors">
                  {t.nav_home}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-[#d4af37] transition-colors">
                  {t.nav_about}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('founders')} className="hover:text-[#d4af37] transition-colors">
                  {t.nav_founders}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('teachers')} className="hover:text-[#d4af37] transition-colors">
                  {t.nav_teachers}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('notices')} className="hover:text-[#d4af37] transition-colors">
                  {t.nav_notices}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('events')} className="hover:text-[#d4af37] transition-colors">
                  {t.nav_events}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('gallery')} className="hover:text-[#d4af37] transition-colors">
                  {t.nav_gallery}
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('downloads')} className="hover:text-[#d4af37] transition-colors">
                  {t.nav_downloads}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Departments */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-[#0a4d28] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              {t.footer_departments}
            </h3>
            <ul className="space-y-2.5 text-xs text-emerald-200">
              {data.departments.map(dep => (
                <li key={dep.id}>
                  <button
                    onClick={() => handleLinkClick('departments')}
                    className="hover:text-[#d4af37] transition-colors text-left"
                  >
                    • {getLocalized(dep.name, language)}
                  </button>
                </li>
              ))}
            </ul>

            {/* Prayer Times Micro Widget */}
            <div className="mt-6 p-3 rounded-lg bg-[#0a4d28]/40 border border-[#0a4d28]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{t.top_prayer_times}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] text-emerald-200 text-center">
                <div className="bg-[#1a2e1a]/80 p-1 rounded">
                  <div className="text-emerald-300 font-medium">{t.top_fajr}</div>
                  <div>{formatDigits(data.settings.prayerTimes.fajr, language)}</div>
                </div>
                <div className="bg-[#1a2e1a]/80 p-1 rounded">
                  <div className="text-emerald-300 font-medium">{t.top_dhuhr}</div>
                  <div>{formatDigits(data.settings.prayerTimes.dhuhr, language)}</div>
                </div>
                <div className="bg-[#1a2e1a]/80 p-1 rounded">
                  <div className="text-emerald-300 font-medium">{t.top_asr}</div>
                  <div>{formatDigits(data.settings.prayerTimes.asr, language)}</div>
                </div>
                <div className="bg-[#1a2e1a]/80 p-1 rounded">
                  <div className="text-emerald-300 font-medium">{t.top_maghrib}</div>
                  <div>{formatDigits(data.settings.prayerTimes.maghrib, language)}</div>
                </div>
                <div className="bg-[#1a2e1a]/80 p-1 rounded">
                  <div className="text-emerald-300 font-medium">{t.top_isha}</div>
                  <div>{formatDigits(data.settings.prayerTimes.isha, language)}</div>
                </div>
                <div className="bg-[#1a2e1a]/80 p-1 rounded">
                  <div className="text-emerald-300 font-medium">{t.top_jummah}</div>
                  <div>{formatDigits(data.settings.prayerTimes.jummah, language)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Social Channels & Portal */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-[#0a4d28] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
              সামাজিক মাধ্যম ও পোর্টাল
            </h3>
            <p className="text-xs text-emerald-200/90 mb-4">
              মাদ্রাসার নিয়মিত আপডেট, ওয়াজ ও ফটো দেখতে আমাদের অফিশিয়াল পেজগুলোতে যুক্ত থাকুন।
            </p>

            <div className="flex items-center gap-2.5 mb-6">
              {data.settings.socialLinks.facebook && (
                <a
                  href={data.settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#0a4d28] hover:bg-[#083e20] text-[#d4af37] hover:text-white transition-colors border border-[#d4af37]/30 shadow-sm"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {data.settings.socialLinks.youtube && (
                <a
                  href={data.settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#0a4d28] hover:bg-[#083e20] text-[#d4af37] hover:text-white transition-colors border border-[#d4af37]/30 shadow-sm"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {data.settings.socialLinks.whatsapp && (
                <a
                  href={data.settings.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#0a4d28] hover:bg-[#083e20] text-[#d4af37] hover:text-white transition-colors border border-[#d4af37]/30 shadow-sm"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-[#0a4d28]/30 border border-[#d4af37]/30 text-xs">
              <div className="text-white font-semibold mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>মাদ্রাসা ম্যানেজমেন্ট পোর্টাল</span>
              </div>
              <p className="text-emerald-200 text-[11px] mb-2.5">
                প্রশাসনিক ও প্রতিষ্ঠাতা তথ্যাদি ব্যবস্থাপনার জন্য লগইন করুন।
              </p>
              <button
                id="footer-portal-login-btn"
                onClick={() => handleLinkClick('portal')}
                className="w-full py-2 px-3 rounded-lg bg-[#0a4d28] hover:bg-[#083e20] text-[#d4af37] text-xs font-bold text-center border border-[#d4af37]/40 transition-colors shadow-sm"
              >
                {t.nav_portal}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="bg-[#142314] border-t border-[#0a4d28] py-4 px-4 sm:px-6 text-xs text-emerald-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            © {currentYear} <strong>{getLocalized(data.settings.name, language)}</strong>। {t.footer_rights}
          </div>
          <div className="flex items-center gap-4 text-emerald-300 text-[11px]">
            <span>{t.footer_designed_for}</span>
            <button onClick={() => handleLinkClick('portal')} className="underline hover:text-[#d4af37]">
              CMS Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
