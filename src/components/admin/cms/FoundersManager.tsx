import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Eye,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  AlertTriangle,
  Award
} from 'lucide-react';
import { useMadrasa } from '../../../context/MadrasaContext';
import { Founder } from '../../../types';
import { getLocalized, toLocal } from '../../../lib/translations';
import { ImageUpload } from '../ImageUpload';
import { hasPermission } from '../../../lib/security';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { validateEmail, validatePhone, validateRequiredText } from '../../../lib/validation';

export const FoundersManager: React.FC = () => {
  const { data, updateData, currentUser, addActivityLog, language, saveEntityWithTranslation, isSaving } = useMadrasa();
  const [editingFounder, setEditingFounder] = useState<Partial<Founder> | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  const [deleteTarget, setDeleteTarget] = useState<Founder | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const canManage = hasPermission(currentUser, 'manage_founders');

  if (!canManage) {
    return (
      <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-950">অনুমতি নেই (Access Restricted)</h3>
        <p className="text-xs text-amber-800 mt-1">
          আপনার অ্যাকাউন্টে প্রতিষ্ঠাতা পরিচিতি ও তথ্য পরিচালনার অনুমতি (manage_founders) নেই।
        </p>
      </div>
    );
  }

  const handleSaveFounder = async (f: Partial<Founder>) => {
    const errors: Record<string, string> = {};

    const nameBnVal = validateRequiredText(f.name?.bn, 'প্রতিষ্ঠাতার বাংলা নাম');
    if (!nameBnVal.isValid) errors.nameBn = nameBnVal.error || '';

    const nameEnVal = validateRequiredText(f.name?.en, 'Founder English Name');
    if (!nameEnVal.isValid) errors.nameEn = nameEnVal.error || '';

    if (f.email && f.email.trim()) {
      const emailVal = validateEmail(f.email, false);
      if (!emailVal.isValid) errors.email = emailVal.error || '';
    }

    if (f.phone && f.phone.trim()) {
      const phoneVal = validatePhone(f.phone, false);
      if (!phoneVal.isValid) errors.phone = phoneVal.error || '';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const newId = f.id || `founder-${Date.now()}`;
    const cleanFounder: Founder = {
      id: newId,
      name: {
        bn: f.name?.bn?.trim() || '',
        en: f.name?.en?.trim() || '',
        ar: f.name?.ar?.trim() || ''
      },
      designation: {
        bn: f.designation?.bn?.trim() || 'আজীবন প্রতিষ্ঠাতা সদস্য',
        en: f.designation?.en?.trim() || 'Lifetime Founder Member',
        ar: f.designation?.ar?.trim() || 'عضو مؤسس مدى الحياة'
      },
      image: f.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      address: {
        bn: f.address?.bn?.trim() || 'সন্দ্বীপ, চট্টগ্রাম',
        en: f.address?.en?.trim() || 'Sandwip, Chittagong',
        ar: f.address?.ar?.trim() || 'ساندويب'
      },
      about: {
        bn: f.about?.bn?.trim() || 'মাদ্রাসার সম্মানিত প্রতিষ্ঠাতা সদস্য।',
        en: f.about?.en?.trim() || '',
        ar: f.about?.ar?.trim() || ''
      },
      biography: {
        bn: f.biography?.bn?.trim() || '',
        en: f.biography?.en?.trim() || '',
        ar: f.biography?.ar?.trim() || ''
      },
      historyContribution: {
        bn: f.historyContribution?.bn?.trim() || '',
        en: f.historyContribution?.en?.trim() || '',
        ar: f.historyContribution?.ar?.trim() || ''
      },
      educationalBackground: {
        bn: f.educationalBackground?.bn?.trim() || '',
        en: f.educationalBackground?.en?.trim() || '',
        ar: f.educationalBackground?.ar?.trim() || ''
      },
      professionalBackground: {
        bn: f.professionalBackground?.bn?.trim() || '',
        en: f.professionalBackground?.en?.trim() || '',
        ar: f.professionalBackground?.ar?.trim() || ''
      },
      founderSince: f.founderSince || '২০১০',
      phone: f.phone || '',
      email: f.email || '',
      isApproved: f.isApproved ?? true,
      order: f.order || data.founders.length + 1,
      linkedUserId: f.linkedUserId
    };

    // Save with server-side auto-translation & persist image to disk / DB
    const saved = await saveEntityWithTranslation('founder', cleanFounder);

    updateData(prev => {
      const exists = prev.founders.some(item => item.id === cleanFounder.id);
      const updatedList = exists
        ? prev.founders.map(item => item.id === cleanFounder.id ? (saved || cleanFounder) : item)
        : [...prev.founders, (saved || cleanFounder)];
      return { ...prev, founders: updatedList };
    });

    addActivityLog(
      f.id ? 'প্রতিষ্ঠাতা তথ্য ও ছবি আপডেট' : 'নতুন প্রতিষ্ঠাতা যোগ',
      saved?.name?.bn || cleanFounder.name.bn,
      `পদবী: ${saved?.designation?.bn || cleanFounder.designation.bn}, ছবি সংরক্ষিত`
    );

    showToast('প্রতিষ্ঠাতার তথ্য ও ছবি সফলভাবে প্রজেক্টে সংরক্ষিত হয়েছে!');
    setEditingFounder(null);
  };

  const handleDeleteFounder = (founder: Founder) => {
    setDeleteTarget(founder);
  };

  const confirmDeleteFounder = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const targetTitle = deleteTarget.name?.bn || 'প্রতিষ্ঠাতা';

    updateData(prev => ({
      ...prev,
      founders: prev.founders.filter(f => f.id !== id)
    }));

    addActivityLog('প্রতিষ্ঠাতা মুছে ফেলা', targetTitle, `আইডি: ${id}`);
    setDeleteTarget(null);
  };

  const handleApprovePendingUpdate = async (founderId: string) => {
    const target = data.founders.find(f => f.id === founderId);
    if (!target || !target.pendingUpdate) return;

    const merged: Founder = {
      ...target,
      ...target.pendingUpdate,
      pendingUpdate: undefined,
      updateSubmittedAt: undefined,
      isApproved: true
    };

    const saved = await saveEntityWithTranslation('founder', merged);

    updateData(prev => ({
      ...prev,
      founders: prev.founders.map(f => f.id === founderId ? (saved || merged) : f)
    }));

    addActivityLog('প্রতিষ্ঠাতা প্রোফাইল অনুমোদন', merged.name.bn, 'প্রতিষ্ঠাতার প্রেরিত প্রোফাইল আপডেট অনুমোদন করা হয়েছে।');
    showToast('প্রতিষ্ঠাতার প্রোফাইল আপডেট অনুমোদিত ও সংরক্ষিত হয়েছে!');
  };

  const pendingUpdates = data.founders.filter(f => f.pendingUpdate);

  return (
    <div className="space-y-6" id="founders-manager-cms">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">প্রতিষ্ঠাতা ও আজীবন সদস্য ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500">
            প্রতিষ্ঠাতা সদস্য, উপদেষ্টা এবং তাঁদের ঐতিহাসিক অবদান ও প্রোফাইল নিয়ন্ত্রণ করুন।
          </p>
        </div>
        <button
          onClick={() =>
            setEditingFounder({
              name: { bn: '', en: '', ar: '' },
              designation: { bn: 'আজীবন প্রতিষ্ঠাতা সদস্য', en: 'Lifetime Founder Member', ar: 'عضو مؤسس مدى الحياة' },
              address: { bn: 'সন্দ্বীপ, চট্টগ্রাম', en: 'Sandwip, Chittagong', ar: 'ساندويب، شيتاغونغ' },
              about: { bn: 'মাদ্রাসার সম্মানিত পৃষ্ঠপোষক ও আজীবন প্রতিষ্ঠাতা সদস্য।', en: '', ar: '' },
              biography: { bn: '', en: '', ar: '' },
              historyContribution: { bn: '', en: '', ar: '' },
              founderSince: '২০১০',
              image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
              isApproved: true
            })
          }
          className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন প্রতিষ্ঠাতা যোগ করুন</span>
        </button>
      </div>

      {/* Tabs & Toast */}
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'all'
              ? 'bg-emerald-800 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          সকল প্রতিষ্ঠাতা ({data.founders.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
          }`}
        >
          <span>অনুমোদন অপেক্ষায়</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white text-amber-900 text-[10px] font-mono font-extrabold">
            {pendingUpdates.length}
          </span>
        </button>
      </div>

      {/* Pending Updates Panel */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {pendingUpdates.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
              বর্তমানে কোনো প্রতিষ্ঠাতার প্রোফাইল আপডেট অনুমোদনের অপেক্ষায় নেই।
            </div>
          ) : (
            pendingUpdates.map(f => (
              <div
                key={f.id}
                className="p-4 rounded-2xl border border-amber-300 bg-amber-50/50 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={f.pendingUpdate?.image || f.image}
                      alt={f.name.bn}
                      className="w-12 h-12 rounded-xl object-cover border border-amber-300"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {f.pendingUpdate?.name?.bn || f.name.bn}
                      </h4>
                      <p className="text-slate-500">
                        জমা দেওয়ার সময়: {f.updateSubmittedAt || 'সাম্প্রতিক'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprovePendingUpdate(f.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700 cursor-pointer"
                    >
                      অনুমোদন করুন (Approve)
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Main List & Editor */}
      {activeTab === 'all' && (
        <>
          {/* Edit Modal / Inline Editor */}
          {editingFounder && (
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-800" />
                  <span>{editingFounder.id ? 'প্রতিষ্ঠাতা প্রোফাইল সম্পাদনা' : 'নতুন প্রতিষ্ঠাতা যোগ'}</span>
                </h3>
                <button
                  onClick={() => setEditingFounder(null)}
                  className="text-slate-500 hover:text-slate-800 font-semibold"
                >
                  বাতিল
                </button>
              </div>

              {/* 2-Field Name Entry Section */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <span>প্রতিষ্ঠাতার নাম (Name Entry - ২ ফিল্ড ইনপুট)</span>
                    <span className="text-red-500 font-bold">*</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>আরবি নাম স্বয়ংক্রিয়ভাবে জেনারেট ও সংরক্ষিত হবে (Auto-Generated Arabic)</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">
                      ১. নাম (বাংলা) *
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: আলহাজ্ব মোঃ আহমেদ উল্ল্যা"
                      value={editingFounder.name?.bn || ''}
                      onChange={e => {
                        setEditingFounder({
                          ...editingFounder,
                          name: {
                            bn: e.target.value,
                            en: editingFounder.name?.en || '',
                            ar: editingFounder.name?.ar || ''
                          }
                        });
                        if (formErrors.nameBn) setFormErrors(prev => ({ ...prev, nameBn: '' }));
                      }}
                      className={`w-full p-2.5 rounded-xl border ${formErrors.nameBn ? 'border-red-500 bg-red-50/30' : 'border-slate-300 bg-white'} outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {formErrors.nameBn && (
                      <p className="text-[11px] text-red-600 mt-1 font-semibold">{formErrors.nameBn}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700">
                      ২. Name (English) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alhaj Md. Ahmed Ullah"
                      value={editingFounder.name?.en || ''}
                      onChange={e => {
                        setEditingFounder({
                          ...editingFounder,
                          name: {
                            bn: editingFounder.name?.bn || '',
                            en: e.target.value,
                            ar: editingFounder.name?.ar || ''
                          }
                        });
                        if (formErrors.nameEn) setFormErrors(prev => ({ ...prev, nameEn: '' }));
                      }}
                      className={`w-full p-2.5 rounded-xl border ${formErrors.nameEn ? 'border-red-500 bg-red-50/30' : 'border-slate-300 bg-white'} outline-none focus:ring-2 focus:ring-emerald-500`}
                    />
                    {formErrors.nameEn && (
                      <p className="text-[11px] text-red-600 mt-1 font-semibold">{formErrors.nameEn}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">পদবী (Designation)</label>
                  <input
                    type="text"
                    placeholder="যেমন: আজীবন প্রতিষ্ঠাতা সদস্য ও পৃষ্ঠপোষক"
                    value={editingFounder.designation?.bn || ''}
                    onChange={e => setEditingFounder({ ...editingFounder, designation: { bn: e.target.value, en: editingFounder.designation?.en || '', ar: editingFounder.designation?.ar || '' } })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">প্রতিষ্ঠার সাল / সংযোগ সাল</label>
                  <input
                    type="text"
                    placeholder="২০১০"
                    value={editingFounder.founderSince || ''}
                    onChange={e => setEditingFounder({ ...editingFounder, founderSince: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">ঠিকানা (Address)</label>
                  <input
                    type="text"
                    placeholder="সন্দ্বীপ, চট্টগ্রাম"
                    value={editingFounder.address?.bn || ''}
                    onChange={e => setEditingFounder({ ...editingFounder, address: { bn: e.target.value, en: editingFounder.address?.en || '', ar: editingFounder.address?.ar || '' } })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">মোবাইল নম্বর (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="018XXXXXXXX"
                    value={editingFounder.phone || ''}
                    onChange={e => {
                      setEditingFounder({ ...editingFounder, phone: e.target.value });
                      if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    className={`w-full p-2.5 rounded-xl border ${formErrors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-300 bg-white'} font-mono`}
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-red-600 mt-1 font-semibold">{formErrors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">ইমেইল (ঐচ্ছিক)</label>
                  <input
                    type="email"
                    placeholder="founder@example.com"
                    value={editingFounder.email || ''}
                    onChange={e => {
                      setEditingFounder({ ...editingFounder, email: e.target.value });
                      if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                    }}
                    className={`w-full p-2.5 rounded-xl border ${formErrors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-300 bg-white'} font-mono`}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-red-600 mt-1 font-semibold">{formErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">সংক্ষিপ্ত পরিচিতি ও বাণী (About)</label>
                <textarea
                  rows={2}
                  value={editingFounder.about?.bn || ''}
                  onChange={e => setEditingFounder({ ...editingFounder, about: { bn: e.target.value, en: editingFounder.about?.en || '', ar: editingFounder.about?.ar || '' } })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">মাদ্রাসায় অবদান ও ঐতিহাসিক প্রেক্ষাপট (Contribution)</label>
                <textarea
                  rows={3}
                  value={editingFounder.historyContribution?.bn || ''}
                  onChange={e => setEditingFounder({ ...editingFounder, historyContribution: { bn: e.target.value, en: editingFounder.historyContribution?.en || '', ar: editingFounder.historyContribution?.ar || '' } })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              {/* Image Upload Component */}
              <div>
                <ImageUpload
                  id="founder-photo-upload"
                  value={editingFounder.image || ''}
                  onChange={img => setEditingFounder({ ...editingFounder, image: img })}
                  label="প্রতিষ্ঠাতার ছবি (Image Upload / Selection)"
                  helperText="JPG, PNG, WEBP ফরম্যাট (প্রজেক্ট ফোল্ডারে সংরক্ষিত হবে)"
                  previewHeight="h-32"
                  folder="founders"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFounder(null)}
                  className="px-4 py-2 bg-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveFounder(editingFounder)}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </div>
          )}

          {/* Founders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.founders.map(founder => (
              <div
                key={founder.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex gap-3 text-xs"
              >
                <img
                  src={founder.image}
                  alt={founder.name.bn}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 flex-shrink-0 bg-slate-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {getLocalized(founder.name, language)}
                      </h4>
                      <p className="text-emerald-800 font-semibold text-[11px]">
                        {getLocalized(founder.designation, language)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingFounder(founder)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800"
                        title="সম্পাদনা"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFounder(founder)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-500 line-clamp-2 mt-1">
                    {getLocalized(founder.about, language)}
                  </p>

                  <div className="flex items-center gap-3 text-slate-400 text-[10px] mt-2 font-medium">
                    <span>প্রতিষ্ঠাতা সাল: {founder.founderSince}</span>
                    <span>•</span>
                    <span>{getLocalized(founder.address, language)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="প্রতিষ্ঠাতা সদস্যের তথ্য মুছে ফেলা"
        itemName={deleteTarget?.name?.bn}
        message="আপনি কি নিশ্চিতভাবে এই প্রতিষ্ঠাতা সদস্যের প্রোফাইল ও তথ্য মুছে ফেলতে চান? এটি মুছে ফেললে ওয়েবসাইট থেকে স্থায়ীভাবে অপসারিত হবে।"
        onConfirm={confirmDeleteFounder}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
