/**
 * Google Translate Integration Utilities
 * Ported from official Google Translate Website Widget implementation
 */

export type SupportedLanguage = 'bn' | 'en' | 'ar';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
];

export const LANG_STORAGE_KEY = 'al_jadid_madrasa_lang';

/**
 * Update the HTML document direction and language attributes
 */
export function changeDirection(lang: string) {
  if (typeof document === 'undefined') return;

  const html = document.documentElement;
  if (lang === 'ar') {
    // Arabic = RTL
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
  } else {
    // English + Bangla = LTR
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', lang);
  }
}

/**
 * Sets Google Translate cookies across all possible domains/paths
 */
export function setGoogleTransCookie(lang: string) {
  if (typeof document === 'undefined') return;

  const host = window.location.hostname;
  const targetVal = lang === 'bn' ? '' : `/bn/${lang}`;
  const autoVal = lang === 'bn' ? '' : `/auto/${lang}`;

  if (lang === 'bn') {
    // Clear cookies for Bengali (default language)
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${host};`;
  } else {
    document.cookie = `googtrans=${targetVal}; path=/;`;
    document.cookie = `googtrans=${targetVal}; path=/; domain=${host};`;
    document.cookie = `googtrans=${autoVal}; path=/;`;
    document.cookie = `googtrans=${autoVal}; path=/; domain=${host};`;
  }
}

/**
 * Hides Google Translate top banner, iframe overlays, and resets body positioning
 */
export function hideGoogleToolbar() {
  if (typeof document === 'undefined') return;

  // Hide Google iframe banners
  const banners = document.querySelectorAll(
    '.goog-te-banner-frame, iframe.goog-te-banner-frame, .goog-te-banner, .skiptranslate.goog-te-gadget-simple'
  );

  banners.forEach(element => {
    const el = element as HTMLElement;
    el.style.display = 'none';
    el.style.visibility = 'hidden';
    el.style.width = '0';
    el.style.height = '0';
    el.style.position = 'absolute';
    el.style.top = '-9999px';
    el.style.left = '-9999px';
  });

  // Reset Google page offset
  if (document.documentElement) {
    document.documentElement.style.marginTop = '0px';
  }
  if (document.body) {
    document.body.style.top = '0px';
    document.body.style.marginTop = '0px';
  }
}

/**
 * Translate the page dynamically using the Google Translate select dropdown & cookies
 */
export function translatePage(lang: string) {
  if (typeof document === 'undefined') return;

  // 1. Set Google Translate Cookie immediately
  setGoogleTransCookie(lang);

  // 2. Dispatch change on the hidden select combo
  let attempts = 0;

  function tryTranslate() {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;

    if (select) {
      if (lang === 'bn') {
        // Try resetting to empty option or 'bn'
        const hasBnOption = Array.from(select.options).some(opt => opt.value === 'bn');
        select.value = hasBnOption ? 'bn' : '';
      } else {
        select.value = lang;
      }

      select.dispatchEvent(new Event('change', { bubbles: true }));
      hideGoogleToolbar();
      return;
    }

    attempts++;
    if (attempts < 50) {
      setTimeout(tryTranslate, 200);
    }
  }

  tryTranslate();
}

/**
 * Initialize Google Translate background monitors
 */
export function initGoogleTranslateService() {
  if (typeof window === 'undefined') return;

  // Keep Google toolbar hidden
  const intervalId = setInterval(hideGoogleToolbar, 150);

  // Monitor for when Google combo becomes available
  function waitForGoogleTranslate() {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      hideGoogleToolbar();
      return;
    }
    setTimeout(waitForGoogleTranslate, 300);
  }

  waitForGoogleTranslate();

  return () => clearInterval(intervalId);
}

