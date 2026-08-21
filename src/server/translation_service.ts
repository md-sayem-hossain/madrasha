import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// Common Islamic, Bengali, and Arabic dictionary for high-accuracy terminology fallback
const ISLAMIC_DICTIONARY: Record<string, { en: string; ar: string }> = {
  // Names & Titles
  'মুহাম্মদ': { en: 'Muhammad', ar: 'محمد' },
  'মোহাম্মদ': { en: 'Mohammad', ar: 'محمد' },
  'আহমেদ': { en: 'Ahmed', ar: 'أحمد' },
  'আহমদ': { en: 'Ahmad', ar: 'أحمد' },
  'আব্দুল্লাহ': { en: 'Abdullah', ar: 'عبد الله' },
  'আব্দুর রহমান': { en: 'Abdur Rahman', ar: 'عبد الرحمن' },
  'মুফতী': { en: 'Mufti', ar: 'مفتي' },
  'মাওলানা': { en: 'Mawlana', ar: 'مولانا' },
  'হাফেজ': { en: 'Hafez', ar: 'حافظ' },
  'কারী': { en: 'Qari', ar: 'قارئ' },
  'শায়খ': { en: 'Shaykh', ar: 'الشيخ' },
  'আল্লামা': { en: 'Allama', ar: 'العلامة' },
  'মুহাদ্দিস': { en: 'Muhaddith', ar: 'محدث' },
  'মুফাসসির': { en: 'Mufassir', ar: 'مفسر' },
  'মুহতামিম': { en: 'Principal / Muhtamim', ar: 'المهتم / مدير المدرسة' },
  'নায়েবে মুহতামিম': { en: 'Vice Principal', ar: 'نائب المهتم' },
  'উস্তাদ': { en: 'Teacher / Ustad', ar: 'أستاذ' },
  'প্রতিষ্ঠাতা': { en: 'Founder', ar: 'المؤسس' },
  'সভাপতি': { en: 'President', ar: 'رئيس المجلس' },
  'সাধারণ সম্পাদক': { en: 'General Secretary', ar: 'الأمين العام' },
  'আজীবন সদস্য': { en: 'Life Member', ar: 'عضو دائم' },

  // Departments
  'হিফজুল কুরআন বিভাগ': { en: 'Hifzul Quran Department', ar: 'قسم تحفيظ القرآن الكريم' },
  'নূরানী ও নাজেরা বিভাগ': { en: 'Noorani & Nazera Department', ar: 'قسم النورانية والناظرة' },
  'কিতাব ও হাদিস বিভাগ': { en: 'Kitab & Hadith Department', ar: 'قسم الكتب والحديث الشريف' },
  'ইফতা ও ফতোয়া বিভাগ': { en: 'Ifta & Islamic Jurisprudence', ar: 'قسم الإفتاء والفقه الإسلامي' },
  'দাওরায়ে হাদিস': { en: 'Dawra-e-Hadith (Masters)', ar: 'دورة الحديث الشريف' },
  'মক্তব বিভাগ': { en: 'Maktab Primary Department', ar: 'قسم المكتب الابتدائي' },

  // Subjects & Qualifications
  'কুরআন মাজিদ ও তাজবিদ': { en: 'Quran Majeed & Tajweed', ar: 'القرآن المجيد والتجويد' },
  'সহীহ বুখারী ও তাফসীর': { en: 'Sahih Bukhari & Tafseer', ar: 'صحيح البخاري والتفسير' },
  'ফিকহ ও উসূলে ফিকহ': { en: 'Fiqh & Usul al-Fiqh', ar: 'الفقه وأصول الفقه' },
  'আরবি ব্যাকরণ ও সাহিত্য': { en: 'Arabic Grammar & Literature', ar: 'النحو والصرف والأدب العربي' },
  'দাওরায়ে হাদিস ও ইফতা': { en: 'Dawra-e-Hadith & Ifta', ar: 'دورة الحديث والإفتاء' },
  'কামিল ও দাওরায়ে হাদিস': { en: 'Kamil & Dawra-e-Hadith', ar: 'كامل ودورة الحديث' },

  // Locations & Common
  'সন্দ্বীপ, চট্টগ্রাম': { en: 'Sandwip, Chittagong', ar: 'ساندويب، شيتاغونغ' },
  'কুড়িয়ামৌড়া, সন্দ্বীপ': { en: 'Kuriamoura, Sandwip', ar: 'كوريا مورا، ساندويب' },
  'বাংলাদেশ': { en: 'Bangladesh', ar: 'بنغلاديش' }
};

// Automatic Arabic name transliterator for fallback
export function transliterateNameToArabic(englishName: string, banglaName: string): string {
  const cleanEn = (englishName || '').trim();
  const cleanBn = (banglaName || '').trim();

  // Check dictionary first
  if (cleanBn && ISLAMIC_DICTIONARY[cleanBn]) {
    return ISLAMIC_DICTIONARY[cleanBn].ar;
  }

  // Name map
  const nameMap: Record<string, string> = {
    'muhammad': 'محمد',
    'mohammad': 'محمد',
    'mohammed': 'محمد',
    'ahmed': 'أحمد',
    'ahmad': 'أحمد',
    'ali': 'علي',
    'hassan': 'حسن',
    'hussain': 'حسين',
    'hossain': 'حسين',
    'abdullah': 'عبد الله',
    'abdur rahman': 'عبد الرحمن',
    'abdur rahim': 'عبد الرحيم',
    'saleha': 'صالحة',
    'saleh': 'صالح',
    'fatima': 'فاطمة',
    'aisha': 'عائشة',
    'khadija': 'خديجة',
    'ibrahim': 'إبراهيم',
    'ismail': 'إسماعيل',
    'yusuf': 'يوسف',
    'dr': 'د.',
    'dr.': 'د.',
    'doctor': 'الدكتور',
    'sayem': 'صائم',
    'mahmud': 'محمود',
    'mahmood': 'محمود',
    'tareq': 'طارق',
    'tariq': 'طارق',
    'rashid': 'راشد',
    'khalid': 'خالد',
    'omar': 'عمر',
    'usman': 'عثمان',
    'osman': 'عثمان',
    'abu bakr': 'أبو بكر',
    'sayed': 'سيد',
    'syed': 'سيد',
    'ullha': 'الله',
    'ullah': 'الله',
    'ullah-saleha': 'الله صالحة',
    'al-jadid': 'الجديد',
    'jadid': 'الجديد',
    'madrasa': 'مدرسة',
    'kuriamoura': 'كوريا مورا',
    'sandwip': 'ساندويب',
    'chittagong': 'شيتاغونغ'
  };

  // Try token matching from English
  if (cleanEn) {
    const tokens = cleanEn.toLowerCase().replace(/[-_]/g, ' ').split(/\s+/);
    const arTokens = tokens.map(t => nameMap[t] || t);
    const combined = arTokens.join(' ');
    // If matched at least some arabic
    if (/[\u0600-\u06FF]/.test(combined)) {
      return combined;
    }
  }

  // Fallback heuristic based on Bengali tokens
  if (cleanBn) {
    const bnTokens = cleanBn.split(/\s+/);
    const translated = bnTokens.map(t => (ISLAMIC_DICTIONARY[t]?.ar) || nameMap[t] || t).join(' ');
    if (/[\u0600-\u06FF]/.test(translated)) {
      return translated;
    }
  }

  return cleanEn || cleanBn;
}

/**
 * High-Quality Meaningful Translator (Gemini 3.7 Flash + Islamic Knowledge Fallback)
 * Translates any missing language field in LocalizedString { bn, en, ar }
 */
export async function translateLocalizedString(
  input: { bn?: string; en?: string; ar?: string },
  contextHint: string = 'Islamic Madrasa Education & Faculty'
): Promise<{ bn: string; en: string; ar: string }> {
  let bn = (input?.bn || '').trim();
  let en = (input?.en || '').trim();
  let ar = (input?.ar || '').trim();

  // If already all 3 are present, return immediately (No API call needed)
  if (bn && en && ar) {
    return { bn, en, ar };
  }

  // If only one language is available or Arabic/English is missing
  const primaryText = bn || en || ar;
  if (!primaryText) {
    return { bn: '', en: '', ar: '' };
  }

  // Try Gemini AI Model first if available
  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `You are a professional multilingual translator specializing in authentic Islamic religious, educational, and academic institutional Bengali, English, and Arabic terminology.

Translate and transliterate the following field into all 3 languages (Bangla 'bn', English 'en', Arabic 'ar').
Context: ${contextHint}
Input Data:
- Bangla: "${bn}"
- English: "${en}"
- Arabic: "${ar}"

Ensure:
1. If this is a personal name (e.g. Dr. Ahmed Ullah, Mufti Abdullah), transcribe it accurately into Classical Arabic (e.g., د. أحمد الله) and polished English without mistakes.
2. For institutional departments and Islamic designations, use correct scholarly Arabic (e.g. "قسم تحفيظ القرآن الكريم", "مفتي ومدرس أول") and standard English.
3. Return ONLY a valid JSON object in this exact format:
{
  "bn": "...",
  "en": "...",
  "ar": "..."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text?.trim() || '';
      if (text) {
        const parsed = JSON.parse(text);
        return {
          bn: bn || parsed.bn || primaryText,
          en: en || parsed.en || primaryText,
          ar: ar || parsed.ar || transliterateNameToArabic(en, bn)
        };
      }
    } catch (err) {
      console.warn('Gemini translation error, falling back to heuristic dictionary:', err);
    }
  }

  // Fallback Heuristic Translator
  if (!en) {
    en = ISLAMIC_DICTIONARY[bn]?.en || bn;
  }
  if (!ar) {
    ar = ISLAMIC_DICTIONARY[bn]?.ar || transliterateNameToArabic(en, bn);
  }
  if (!bn) {
    bn = en || ar;
  }

  return { bn, en, ar };
}

/**
 * Deeply translates all LocalizedString fields within an entity before saving to the database
 */
export async function translateEntityFields(entity: any, type: string): Promise<any> {
  if (!entity || typeof entity !== 'object') return entity;

  const result = { ...entity };

  // For name fields: if bn and en are provided, auto-generate/verify ar
  if (result.name && typeof result.name === 'object') {
    result.name = await translateLocalizedString(result.name, `Person Name in ${type}`);
  }

  // Check common LocalizedString properties
  const localizedKeys = [
    'designation',
    'department',
    'subject',
    'qualifications',
    'experience',
    'biography',
    'address',
    'about',
    'historyContribution',
    'educationalBackground',
    'professionalBackground',
    'title',
    'description',
    'location',
    'publishedBy',
    'speaker',
    'presenter',
    'shortName',
    'slogan'
  ];

  for (const key of localizedKeys) {
    if (result[key] && typeof result[key] === 'object' && (result[key].bn || result[key].en || result[key].ar)) {
      result[key] = await translateLocalizedString(result[key], `${key} field in ${type}`);
    }
  }

  return result;
}
