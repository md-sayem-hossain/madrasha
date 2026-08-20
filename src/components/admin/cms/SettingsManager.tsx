import React, { useState } from 'react';
import {
  Settings,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Bell,
  Save,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useMadrasa } from '../../../context/MadrasaContext';
import { InstitutionSettings, PrayerTimes } from '../../../types';
import { ImageUpload } from '../ImageUpload';
import { hasPermission } from '../../../lib/security';

export const SettingsManager: React.FC = () => {
  const { data, updateData, currentUser, addActivityLog } = useMadrasa();
  const [settingsForm, setSettingsForm] = useState<InstitutionSettings>(data.settings);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const canManage = hasPermission(currentUser, 'manage_settings');

  if (!canManage) {
    return (
      <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-950">অনুমতি নেই (Access Restricted)</h3>
        <p className="text-xs text-amber-800 mt-1">
          আপনার অ্যাকাউন্টে প্রাতিষ্ঠানিক সেটিংস পরিচালনার অনুমতি (manage_settings) নেই।
        </p>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    updateData(prev => ({
      ...prev,
      settings: settingsForm
    }));

    addActivityLog('প্রাতিষ্ঠানিক সেটিংস সংরক্ষণ', settingsForm.name.bn, 'নাম, নামাজের সময় ও যোগাযোগ তথ্য আপডেট করা হয়েছে।');
    showToast('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  return (
    <div className="space-y-6" id="settings-manager-cms">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">প্রাতিষ্ঠানিক সেটিংস ও নামাজের সময়সূচি</h2>
          <p className="text-xs text-slate-500">
            মাদ্রাসার নাম, স্লোগান, যোগাযোগের ঠিকানা, জরুরি নোটিশ বার ও নামাজের সময়সূচি পরিবর্তন করুন।
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>সব সেটিংস সংরক্ষণ করুন</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Basic Info */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-800" />
          <span>প্রাতিষ্ঠানিক নাম ও স্লোগান</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-1 text-slate-700">মাদ্রাসার নাম (বাংলা) *</label>
            <input
              type="text"
              value={settingsForm.name.bn}
              onChange={e => setSettingsForm({ ...settingsForm, name: { ...settingsForm.name, bn: e.target.value } })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700">নাম (English)</label>
            <input
              type="text"
              value={settingsForm.name.en}
              onChange={e => setSettingsForm({ ...settingsForm, name: { ...settingsForm.name, en: e.target.value } })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700">اسم المدرسة (العربية)</label>
            <input
              type="text"
              value={settingsForm.name.ar}
              onChange={e => setSettingsForm({ ...settingsForm, name: { ...settingsForm.name, ar: e.target.value } })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-arabic text-right"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1 text-slate-700">মূল স্লোগান (বাংলা)</label>
            <input
              type="text"
              value={settingsForm.slogan.bn}
              onChange={e => setSettingsForm({ ...settingsForm, slogan: { ...settingsForm.slogan, bn: e.target.value } })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700">প্রতিষ্ঠার সাল</label>
            <input
              type="text"
              value={settingsForm.establishedYear}
              onChange={e => setSettingsForm({ ...settingsForm, establishedYear: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Prayer Times Configuration */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-800" />
          <span>দৈনিক পাঁচ ওয়াক্ত নামাজের জামাত সময়সূচি</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
          <div>
            <label className="block font-semibold mb-1 text-slate-700 text-[11px]">ফজর (Fajr)</label>
            <input
              type="text"
              value={settingsForm.prayerTimes.fajr}
              onChange={e => setSettingsForm({ ...settingsForm, prayerTimes: { ...settingsForm.prayerTimes, fajr: e.target.value } })}
              className="w-full p-2 rounded-xl border border-slate-300 text-center font-bold text-emerald-900 bg-emerald-50/40"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700 text-[11px]">যোহর (Dhuhr)</label>
            <input
              type="text"
              value={settingsForm.prayerTimes.dhuhr}
              onChange={e => setSettingsForm({ ...settingsForm, prayerTimes: { ...settingsForm.prayerTimes, dhuhr: e.target.value } })}
              className="w-full p-2 rounded-xl border border-slate-300 text-center font-bold text-emerald-900 bg-emerald-50/40"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700 text-[11px]">আসর (Asr)</label>
            <input
              type="text"
              value={settingsForm.prayerTimes.asr}
              onChange={e => setSettingsForm({ ...settingsForm, prayerTimes: { ...settingsForm.prayerTimes, asr: e.target.value } })}
              className="w-full p-2 rounded-xl border border-slate-300 text-center font-bold text-emerald-900 bg-emerald-50/40"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700 text-[11px]">মাগরিব (Maghrib)</label>
            <input
              type="text"
              value={settingsForm.prayerTimes.maghrib}
              onChange={e => setSettingsForm({ ...settingsForm, prayerTimes: { ...settingsForm.prayerTimes, maghrib: e.target.value } })}
              className="w-full p-2 rounded-xl border border-slate-300 text-center font-bold text-emerald-900 bg-emerald-50/40"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700 text-[11px]">ইশা (Isha)</label>
            <input
              type="text"
              value={settingsForm.prayerTimes.isha}
              onChange={e => setSettingsForm({ ...settingsForm, prayerTimes: { ...settingsForm.prayerTimes, isha: e.target.value } })}
              className="w-full p-2 rounded-xl border border-slate-300 text-center font-bold text-emerald-900 bg-emerald-50/40"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700 text-[11px]">জুমুআ (Jummah)</label>
            <input
              type="text"
              value={settingsForm.prayerTimes.jummah}
              onChange={e => setSettingsForm({ ...settingsForm, prayerTimes: { ...settingsForm.prayerTimes, jummah: e.target.value } })}
              className="w-full p-2 rounded-xl border border-slate-300 text-center font-bold text-emerald-900 bg-emerald-50/40"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-800" />
          <span>যোগাযোগ ও ঠিকানা</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1 text-slate-700">মোবাইল / হেল্পলাইন নম্বর</label>
            <input
              type="text"
              value={settingsForm.phone}
              onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700">অফিসিয়াল ইমেইল এড্রেস</label>
            <input
              type="email"
              value={settingsForm.email}
              onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-slate-700">ঠিকানা (বাংলা)</label>
          <input
            type="text"
            value={settingsForm.address.bn}
            onChange={e => setSettingsForm({ ...settingsForm, address: { ...settingsForm.address, bn: e.target.value } })}
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
