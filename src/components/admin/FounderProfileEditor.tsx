import React, { useState } from 'react';
import {
  UserCheck,
  Save,
  CheckCircle,
  Eye,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  BookOpen,
  HeartHandshake,
  MessageSquare,
  GraduationCap,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { Founder } from '../../types';
import { toLocal, getLocalized } from '../../lib/translations';
import { ImageUpload } from './ImageUpload';

export const FounderProfileEditor: React.FC = () => {
  const { currentUser, data, updateData, addActivityLog, language, saveEntityWithTranslation } = useMadrasa();

  // Find linked founder or fallback to first founder
  const linkedFounder = data.founders.find(
    f => f.id === currentUser?.linkedFounderId || f.linkedUserId === currentUser?.id
  ) || data.founders[0];

  const [formState, setFormState] = useState<Founder>(() => {
    if (linkedFounder) return { ...linkedFounder };
    return {
      id: `founder-${Date.now()}`,
      name: toLocal(currentUser?.name || 'প্রতিষ্ঠাতা সদস্য'),
      designation: toLocal('আজীবন প্রতিষ্ঠাতা সদস্য'),
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      address: toLocal('সদর, লক্ষ্মীপুর'),
      about: toLocal('মাদ্রাসার সম্মানিত প্রতিষ্ঠাতা ও আজীবন পৃষ্ঠপোষক।'),
      biography: toLocal(''),
      historyContribution: toLocal(''),
      educationalBackground: toLocal(''),
      professionalBackground: toLocal(''),
      founderSince: '২০১০',
      isApproved: true,
      order: 1
    };
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = async () => {
    if (!formState.name.bn.trim()) {
      alert('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন');
      return;
    }

    const saved = await saveEntityWithTranslation('founder', formState);

    updateData(prev => {
      const exists = prev.founders.some(f => f.id === formState.id);
      let updatedFounders;
      if (exists) {
        updatedFounders = prev.founders.map(f => (f.id === formState.id ? (saved || formState) : f));
      } else {
        updatedFounders = [...prev.founders, (saved || formState)];
      }
      return { ...prev, founders: updatedFounders };
    });

    addActivityLog(
      'প্রতিষ্ঠাতা প্রোফাইল সম্পাদনা',
      saved?.name?.bn || formState.name.bn,
      'প্রতিষ্ঠাতা তাঁর নিজস্ব প্রোফাইল, ছবি, অবদান ও জীবনী আপডেট করেছেন।'
    );

    showToast('আপনার প্রোফাইল তথ্য ও ছবি সফলভাবে প্রজেক্টে সংরক্ষিত ও লাইভ করা হয়েছে!');
  };

  return (
    <div id="founder-profile-editor" className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-600 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Permission & Identity Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-600 text-white flex-shrink-0 mt-0.5">
          <UserCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
            <span>প্রতিষ্ঠাতা নিয়ন্ত্রণ কক্ষ (Founder Access)</span>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              অনুমতি: শুধুমাত্র নিজস্ব প্রোফাইল
            </span>
          </h3>
          <p className="text-xs text-amber-900/80 leading-relaxed">
            আপনি মাদ্রাসা প্রতিষ্ঠাতা হিসেবে লগইন করেছেন। আপনার দায়িত্বের অধীনে আপনি শুধুমাত্র আপনার নিজস্ব নাম, ছবি,
            বাণী, বিস্তারিত জীবনবৃত্তান্ত ও মাদ্রাসায় অবদানের ইতিহাস সম্পাদনা করতে পারবেন। সংরক্ষিত পরিবর্তন ওয়েবসাইটে তাৎক্ষণিক দৃশ্যমান হবে।
          </p>
        </div>
      </div>

      {/* Header with Save Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">আমার প্রোফাইল ও পরিচিতি সম্পাদনা</h2>
          <p className="text-xs text-slate-500">
            ওয়েবসাইটে প্রদর্শিত আপনার ব্যক্তিগত প্রোফাইল কার্ড ও বিস্তারিত পাতা হালনাগাদ করুন।
          </p>
        </div>
        <button
          id="save-founder-profile-btn"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <Save className="w-4 h-4 text-amber-300" />
          <span>পরিবর্তন সংরক্ষণ করুন</span>
        </button>
      </div>

      {/* Editor Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Inputs */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              প্রাথমিক পরিচয় ও পদবী
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">পূর্ণ নাম (বাংলা) *</label>
                <input
                  type="text"
                  value={formState.name.bn}
                  onChange={e => setFormState({ ...formState, name: { ...formState.name, bn: e.target.value } })}
                  placeholder="উদাঃ ডাঃ আহমেদ উল্ল্যা"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">নাম (English)</label>
                <input
                  type="text"
                  value={formState.name.en}
                  onChange={e => setFormState({ ...formState, name: { ...formState.name, en: e.target.value } })}
                  placeholder="e.g. Dr. Ahmed Ullah"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">পদবী (বাংলা)</label>
                <input
                  type="text"
                  value={formState.designation.bn}
                  onChange={e => setFormState({ ...formState, designation: { ...formState.designation, bn: e.target.value } })}
                  placeholder="উদাঃ প্রতিষ্ঠাতা ও সভাপতি"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">প্রতিষ্ঠাতা সদস্য সাল</label>
                <input
                  type="text"
                  value={formState.founderSince}
                  onChange={e => setFormState({ ...formState, founderSince: e.target.value })}
                  placeholder="উদাঃ ২০১০"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <ImageUpload
                id="founder-profile-image-upload"
                value={formState.image}
                onChange={(img) => setFormState({ ...formState, image: img })}
                label="প্রোফাইল ছবি আপলোড (Upload Profile Photo)"
                helperText="আপনার পাসপোর্ট বা স্পষ্ট পোর্ট্রেট ছবি আপলোড করুন"
                previewHeight="h-28"
                folder="founders"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              যোগাযোগ ও ঠিকানা
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ফোন নম্বর</label>
                <input
                  type="text"
                  value={formState.phone || ''}
                  onChange={e => setFormState({ ...formState, phone: e.target.value })}
                  placeholder="017XXXXXXXX"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  value={formState.email || ''}
                  onChange={e => setFormState({ ...formState, email: e.target.value })}
                  placeholder="founder@example.com"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">বর্তমান ঠিকানা</label>
              <input
                type="text"
                value={formState.address.bn}
                onChange={e => setFormState({ ...formState, address: { ...formState.address, bn: e.target.value } })}
                placeholder="উদাঃ লক্ষ্মীপুর সদর, বাংলাদেশ"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              সংক্ষিপ্ত বার্তা, জীবনী ও মাদ্রাসায় অবদান
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">সংক্ষিপ্ত পরিচয় / বার্তা (Short About)</label>
              <textarea
                rows={2}
                value={formState.about.bn}
                onChange={e => setFormState({ ...formState, about: { ...formState.about, bn: e.target.value } })}
                placeholder="মাদ্রাসার প্রতি শুভকামনা বা আপনার সংক্ষিপ্ত পরিচয়..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                মাদ্রাসায় বিশেষ অবদান ও ভূমিকা (Madrasa Contribution)
              </label>
              <textarea
                rows={3}
                value={formState.historyContribution.bn}
                onChange={e =>
                  setFormState({
                    ...formState,
                    historyContribution: { ...formState.historyContribution, bn: e.target.value }
                  })
                }
                placeholder="মাদ্রাসার জমি দান, ভবন নির্মাণ, ফান্ডিং বা অন্যান্য অবদানের বিবরণ..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                বিস্তারিত জীবনবৃত্তান্ত (Detailed Biography & Life Sketch)
              </label>
              <textarea
                rows={5}
                value={formState.biography.bn}
                onChange={e =>
                  setFormState({ ...formState, biography: { ...formState.biography, bn: e.target.value } })
                }
                placeholder="আপনার জন্ম, কর্মজীবন, সমাজসেবা ও ধর্মীয় কার্যাবলীর বিস্তারিত তথ্য..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা</label>
                <input
                  type="text"
                  value={formState.educationalBackground?.bn || ''}
                  onChange={e =>
                    setFormState({
                      ...formState,
                      educationalBackground: toLocal(e.target.value)
                    })
                  }
                  placeholder="উদাঃ এমবিবিএস (ঢাকা মেডিকেল), এফসিপিএস"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">পেশাগত বিবরণ</label>
                <input
                  type="text"
                  value={formState.professionalBackground?.bn || ''}
                  onChange={e =>
                    setFormState({
                      ...formState,
                      professionalBackground: toLocal(e.target.value)
                    })
                  }
                  placeholder="উদাঃ বিশিষ্ট চিকিৎসক ও সমাজসেবক"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Preview Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md sticky top-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                <span>লাইভ প্রোফাইল প্রিভিউ</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                ওয়েবসাইট ভিউ
              </span>
            </div>

            <div className="text-center space-y-3">
              <div className="relative inline-block">
                <img
                  src={formState.image}
                  alt={formState.name.bn}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-[#d4af37]/30 mx-auto shadow"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400';
                  }}
                />
                <span className="absolute -bottom-2 -right-1 bg-[#0a4d28] text-[#d4af37] text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-[#d4af37]">
                  {formState.founderSince} থেকে
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {formState.name.bn || 'নাম লিখুন'}
                </h3>
                <p className="text-xs text-[#0a4d28] font-medium">
                  {formState.designation.bn || 'পদবী'}
                </p>
                {formState.address.bn && (
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>{formState.address.bn}</span>
                  </p>
                )}
              </div>

              {formState.about.bn && (
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-150 text-left italic">
                  "{formState.about.bn}"
                </p>
              )}

              {formState.historyContribution.bn && (
                <div className="text-left text-xs bg-emerald-50/70 p-3 rounded-xl border border-emerald-150 space-y-1">
                  <div className="font-bold text-emerald-950 flex items-center gap-1 text-[11px]">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
                    <span>মাদ্রাসায় অবদান:</span>
                  </div>
                  <p className="text-emerald-900/90 text-[11px] line-clamp-3">
                    {formState.historyContribution.bn}
                  </p>
                </div>
              )}

              <button
                onClick={handleSave}
                className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
