# ডাঃ আহমেদ উল্ল্যা-ছালেহা আল-জাদিদ মাদ্রাসা
## Comprehensive Web & CMS Portal Architecture Documentation

---

### ১. সিস্টেম ওভারভিউ ও প্রযুক্তি কাঠামো (System Architecture Overview)

ডাঃ আহমেদ উল্ল্যা-ছালেহা আল-জাদিদ মাদ্রাসার ওয়েব পোর্টাল ও সিএমএস একটি আধুনিক, সম্পূর্ণ কার্যকরী, বহুভাষিক (বাংলা, ইংরেজি, আরবি) প্ল্যাটফর্ম। এটি সিঙ্গেল পেজ অ্যাপ্লিকেশন (SPA) হিসেবে ফ্রন্টএন্ড এবং এক্সপ্রেস চালিত ব্যাকএন্ড এপিআই দিয়ে গঠিত:

```
+-----------------------------------------------------------------------------------+
|                              Public & Admin Web Client                            |
|          (React 18, Vite, Tailwind CSS, Lucide Icons, Custom State Management)     |
+-----------------------------------------+-----------------------------------------+
                                          |
                        HTTP REST API / WebSocket Signals
                                          |
+-----------------------------------------v-----------------------------------------+
|                                Express.js API Server                              |
|                    (/api/data, /api/founders, /api/notices, etc.)                 |
+--------------------+------------------------------------+-------------------------+
                     |                                    |
+--------------------v-------------+     +----------------v-------------------------+
| Local File-backed JSON Storage   |     | Relational Database (MySQL / PostgreSQL) |
| (Auto-synced under /server_data) |     | (Configured via database.sql)            |
+----------------------------------+     +------------------------------------------+
```

#### মূল প্রযুক্তিসমূহ (Core Technologies):
- **Frontend Framework:** React 18 with Vite, TypeScript
- **Styling:** Tailwind CSS with custom Islamic green & warm amber palettes, responsive grid layouts
- **Icons:** `lucide-react`
- **State Management & Persistence:** React Context (`MadrasaContext.tsx`) + `localStorage` + `window.location.hash`
- **Localization Engine:** Google Translate Website Widget (`index.html`) + Custom Numeral & Date Localization Engine (`src/lib/translations.ts`)
- **Backend API:** Node.js + Express.js REST API with file-based JSON persistence and MySQL schema integration

---

### ২. বহুভাষিক ও লোকালাইজেশন আর্কিটেকচার (Localization & Translation Architecture)

ওয়েবসাইটটিতে তিনটি ভাষার (বাংলা, ইংরেজি, আরবি) জন্য উন্নত দ্বিস্তরীয় লোকালাইজেশন আর্কিটেকচার বাস্তবায়ন করা হয়েছে:

#### ক. টেক্সট ও কন্টেন্ট ট্রান্সলেশন (Google Translate Website Widget)
- **ইন্টিগ্রেশন (`index.html`):** অফিসিয়াল গুগল ট্রান্সলেট এলিমেন্ট স্ক্রিপ্ট ব্যাকগ্রাউন্ডে ইনিশিয়ালাইজ হয়।
- **ক্লিন ইউআই (No Default Google Banner):** গুগল ট্রান্সলেটের ডিফল্ট ব্যানার এবং ফ্রেম সিএসএস দিয়ে সম্পূর্ণরূপে গোপন রাখা হয়েছে (`.goog-te-banner-frame`, `body > .skiptranslate` display: none)।
- **ডিরেকশন কন্ট্রোল:** আরবি নির্বাচন করা হলে পুরো অ্যাপ্লিকেশনটির ডকুমেন্ট ডিরেকশন স্বয়ংক্রিয়ভাবে `dir="rtl"`-এ পরিবর্তিত হয় এবং ফন্ট স্টাইলিং আরবি চারুলিপির সাথে সামঞ্জস্য বজায় রাখে।
- **আরবি লোগো সংরক্ষণ (`notranslate` / `translate="no"`):** ব্যবহারকারীর পছন্দ অনুযায়ী আরবি ক্যালিগ্রাফিক লোগোটি অন্য যেকোনো ভাষা পরিবর্তনেও অবিকৃত থাকে। এটি নিশ্চিত করতে লোগো ট্যাগে `notranslate` ক্লাস ও `translate="no"` অ্যাট্রিবিউট নিশ্চিত করা হয়েছে।

#### খ. সংখ্যা, তারিখ ও সময়ের কাস্টম লোকালাইজেশন ইঞ্জিন (`src/lib/translations.ts`)
যেহেতু গুগল ট্রান্সলেট ডায়নামিক সংখ্যা ও ইসলামিক তারিখ নির্ভুলভাবে রূপান্তর করে না, তাই ডেডিকেটেড ইউটিলিটি ফাংশন তৈরি করা হয়েছে:
1. **`formatDigits(val, language)`**:
   - ইংরেজি সংখ্যা (`0-9`) কে বাংলায় (`০-৯`) এবং আরবিতে (`٠-٩`) রূপান্তর করে।
   - পরিসংখ্যান সংখ্যা (যেমন: ৩৫০+ শিক্ষার্থী, ১৮+ শিক্ষক, ১২০+ হাফেজ), প্রতিষ্ঠার সাল (১৯৯৮), ফোন নম্বর, পেইজ কাউন্টার ইত্যাদি নিখুঁতভাবে প্রদর্শিত হয়।
2. **`formatDate(dateStr, language)`**:
   - যেকোনো স্ট্যান্ডার্ড তারিখ (`YYYY-MM-DD` বা টেক্সট) কে ভাষা অনুযায়ী স্থানীয় মাস ও সংখ্যায় রূপান্তর করে (যেমন: `১০ জানুয়ারি, ২০২৪` / `10 January, 2024` / `١٠ يناير ٢٠٢٤`)।
3. **`formatTime(timeStr, language)`**:
   - নামাজের সময়সূচি (ফজর ০৪:৪৭, যোহর ১২:০৬, আসর ০৪:৩৮, মাগরিব ০৬:২৫, ইশা ০৭:৪৪, জুমা ০১:১৫) এবং ইভেন্টের সময় সঠিকভাবে কনভার্ট করে।

---

### ৩. স্টেট ও রাউটিং পারসিস্টেন্স (State & Navigation Persistence)

পূর্বে পেজ রিলোড দিলে হোমপেজে ফিরে যাওয়ার সমস্যাটির স্থায়ী সমাধান করা হয়েছে:
1. **URL Hash সিঙ্ক্রোনাইজেশন:** 
   - ইউজার যখন কোনো ট্যাবে নেভিগেট করেন (যেমন: `contact`, `notices`, `events`, `teachers`, `founders`, `downloads`, `about-history`), তা সাথে সাথে ব্রাউজারের `window.location.hash` (যেমন `#contact`) এবং `localStorage` এ সংরক্ষিত হয়।
2. **স্মার্ট বুটস্ট্র্যাপ:**
   - পেজ রিলোড বা রিফ্রেশ হওয়ার সময় `MadrasaContext` প্রথমে URL Hash চেক করে, এরপর `localStorage` পড়ে এবং ইউজার যে পেজে ছিলেন হুবহু সেই পেজেই লোড সম্পন্ন করে।

---

### ৪. ব্যাকএন্ড এপিআই ও ডেটাবেজ স্কিমা (Backend API & Database Structure)

#### ক. ব্যাকএন্ড REST API এন্ডপয়েন্টসমূহ (`server.ts`)
- `GET /api/data`: সমগ্র মাদ্রাসার ডেটা লোড (সেটিংস, শিক্ষক, প্রতিষ্ঠাতা, নোটিশ, ইভেন্ট, গ্যালারি, ইত্যাদি)।
- `POST /api/settings`: মাদ্রাসার তথ্য, যোগাযোগের ঠিকানা, নামাজের সময়সূচি আপডেট।
- `POST /api/founders` & `PUT /api/founders/:id`: প্রতিষ্ঠাতা তথ্য ব্যবস্থাপনা ও মডারেশন রিভিউ।
- `POST /api/teachers` & `PUT /api/teachers/:id`: শিক্ষক ও কর্মকর্তাদের প্রোফাইল আপডেট।
- `POST /api/notices` & `DELETE /api/notices/:id`: নোটিশ ও সার্কুলার প্রকাশনা।
- `POST /api/events`: মাহফিল ও বিশেষ অনুষ্ঠানের সময়সূচি।
- `POST /api/gallery`: ক্যাম্পাসের ফটো অ্যালবাম সংরক্ষণ।
- `POST /api/audios` & `POST /api/videos`: ইসলামিক ওয়াজ, অডিও তিলাওয়াত ও ভিডিও লেকচার।
- `POST /api/downloads`: ভর্তি ফরম, সিলেবাস ও প্রসপেক্টাস ফাইল।
- `POST /api/contacts`: ভিজিটরদের বার্তা গ্রহণ ও স্টোরেজ।
- `POST /api/logs`: অ্যাডমিন অ্যাক্টিভিটি ট্র্যাকিং।

#### খ. ডেটাবেজ স্কিমা (`database.sql`)
ডেটাবেজটি `utf8mb4` এবং `utf8mb4_unicode_ci` এনকোডিংয়ে প্রস্তুত, যা বাংলা এবং আরবি উভয়ের জন্য শতভাগ উপযুক্ত। প্রধান টেবিলসমূহ:
- `institution_settings`: প্রাতিষ্ঠানিক তথ্য, নামাজের সময়সূচি ও পরিসংখ্যান
- `users`: অ্যাডমিন ও মডারেটর একাউন্ট (RBAC)
- `founders`: প্রতিষ্ঠাতা ও আজীবন দাতাগণের তালিকা এবং মডারেশন কিউ
- `teachers`: অনুষদ ও শিক্ষকবৃন্দের প্রোফাইল
- `departments`: শিক্ষা বিভাগ ও পাঠ্যক্রম
- `notices`: নোটিশ ও সার্কুলার
- `events`: বার্ষিক মাহফিল ও ইসলামি সম্মেলন
- `gallery`: ফটো গ্যালারি
- `audio_tracks`: অডিও বয়ান ও তিলাওয়াত
- `videos`: ভিডিও ওয়াজ ও তথ্যচিত্র
- `downloads`: প্রকাশনা ও ভর্তি ফরম
- `contacts`: যোগাযোগের বার্তা
- `history_milestones`: মাদ্রাসার প্রতিষ্ঠা ও ঐতিহাসিক মাইলফলক
- `activity_logs`: প্রশাসনিক অডিট ট্রেইল

---

### ৫. প্রোডাকশন ডেপ্লয়মেন্ট গাইড (Production Deployment Strategy)

1. **লোকাল MySQL ডেটাবেজ সেটআপ:**
   - MySQL সার্ভারে `database.sql` স্ক্রিপ্টটি এক্সিকিউট করুন।
   - `.env` ফাইলে ডাটাবেজ ক্রেডেনশিয়ালস (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) সেট করুন।
2. **গুগল ক্লাউড রান বা ভিপিএস ডেপ্লয়মেন্ট:**
   - বিল্ড কমান্ড: `npm run build`
   - রান কমান্ড: `node server.ts` বা `npm run start`
   - ক্লাউড সিকিউরিটি: এনভায়রনমেন্ট ভেরিয়েবল সিক্রেট ম্যানেজারের মাধ্যমে সুরক্ষিত রাখুন।
