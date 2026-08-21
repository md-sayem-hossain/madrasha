import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Edit2,
  Pin,
  Search,
  AlertTriangle,
  FileText,
  Calendar,
  Eye,
  Sparkles
} from 'lucide-react';
import { useMadrasa } from '../../../context/MadrasaContext';
import { Notice } from '../../../types';
import { getLocalized } from '../../../lib/translations';
import { FileUpload } from '../FileUpload';
import { hasPermission } from '../../../lib/security';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { validateRequiredText } from '../../../lib/validation';

export const NoticesManager: React.FC = () => {
  const { data, updateData, currentUser, addActivityLog, language, setSelectedNotice, saveEntityWithTranslation, isSaving } = useMadrasa();
  const [editingNotice, setEditingNotice] = useState<Partial<Notice> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const canManage = hasPermission(currentUser, 'manage_notices');

  if (!canManage) {
    return (
      <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-950">অনুমতি নেই (Access Restricted)</h3>
        <p className="text-xs text-amber-800 mt-1">
          আপনার অ্যাকাউন্টে নোটিশ বোর্ড ও বিজ্ঞপ্তি পরিচালনার অনুমতি (manage_notices) নেই।
        </p>
      </div>
    );
  }

  const handleSaveNotice = async (notice: Partial<Notice>) => {
    const errors: Record<string, string> = {};

    const titleBnVal = validateRequiredText(notice.title?.bn, 'নোটিশের শিরোনাম (বাংলা)');
    if (!titleBnVal.isValid) errors.titleBn = titleBnVal.error || '';

    const titleEnVal = validateRequiredText(notice.title?.en, 'Notice Title (English)');
    if (!titleEnVal.isValid) errors.titleEn = titleEnVal.error || '';

    const descBnVal = validateRequiredText(notice.description?.bn, 'নোটিশের মূল বক্তব্য / বিবরণ');
    if (!descBnVal.isValid) errors.descriptionBn = descBnVal.error || '';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const newId = notice.id || `not-${Date.now()}`;
    const cleanNotice: Notice = {
      id: newId,
      title: {
        bn: notice.title?.bn?.trim() || '',
        en: notice.title?.en?.trim() || '',
        ar: notice.title?.ar?.trim() || ''
      },
      description: {
        bn: notice.description?.bn?.trim() || '',
        en: notice.description?.en?.trim() || '',
        ar: notice.description?.ar?.trim() || ''
      },
      category: notice.category || 'general',
      date: notice.date || new Date().toISOString().split('T')[0],
      expiryDate: notice.expiryDate,
      attachmentUrl: notice.attachmentUrl,
      attachmentName: notice.attachmentName || (notice.attachmentUrl ? 'নোটিশ সার্কুলার ফাইল' : undefined),
      isPinned: !!notice.isPinned,
      isPublished: notice.isPublished !== false,
      publishedBy: {
        bn: notice.publishedBy?.bn || 'মাদ্রাসা প্রশাসন দপ্তর',
        en: notice.publishedBy?.en || 'Madrasa Administration',
        ar: notice.publishedBy?.ar || 'إدارة المدرسة'
      }
    };

    const saved = await saveEntityWithTranslation('notice', cleanNotice);

    addActivityLog(
      notice.id ? 'নোটিশ সম্পাদন' : 'নতুন নোটিশ প্রকাশ',
      saved?.title?.bn || cleanNotice.title.bn,
      `ক্যাটাগরি: ${cleanNotice.category}, পিন করা: ${cleanNotice.isPinned ? 'হ্যাঁ' : 'না'}`
    );

    setEditingNotice(null);
  };

  const handleDeleteNotice = (notice: Notice) => {
    setDeleteTarget(notice);
  };

  const confirmDeleteNotice = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const targetTitle = deleteTarget.title?.bn || 'নোটিশ';

    updateData(prev => ({
      ...prev,
      notices: prev.notices.filter(n => n.id !== id)
    }));

    addActivityLog('নোটিশ মুছে ফেলা', targetTitle, `আইডি: ${id}`);
    setDeleteTarget(null);
  };

  const togglePin = (id: string, currentPin: boolean) => {
    updateData(prev => ({
      ...prev,
      notices: prev.notices.map(n => n.id === id ? { ...n, isPinned: !currentPin } : n)
    }));
  };

  const filteredNotices = data.notices.filter(n => {
    const matchQuery = (n.title?.bn + n.title?.en + n.description?.bn).toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchQuery) return false;
    if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6" id="notices-manager-cms">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">নোটিশ বোর্ড ও জরুরি বিজ্ঞপ্তি ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500">
            ভর্তি, পরীক্ষা, ছুটি ও প্রাতিষ্ঠানিক নোটিশ প্রকাশ করুন এবং সংযুক্তি ফাইল যুক্ত করুন।
          </p>
        </div>
        <button
          onClick={() =>
            setEditingNotice({
              title: { bn: '', en: '', ar: '' },
              description: { bn: '', en: '', ar: '' },
              category: 'general',
              date: new Date().toISOString().split('T')[0],
              isPinned: false,
              isPublished: true,
              publishedBy: { bn: 'মাদ্রাসা প্রশাসন দপ্তর', en: 'Administration Office', ar: 'مكتب الإدارة' }
            })
          }
          className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন নোটিশ প্রকাশ</span>
        </button>
      </div>

      {/* Notice Editor Form */}
      {editingNotice && (
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4 text-xs sm:text-sm animate-in fade-in duration-150">
          <div className="font-bold text-amber-950 flex items-center justify-between border-b border-amber-200 pb-2">
            <span>{editingNotice.id ? 'নোটিশ সম্পাদন' : 'নতুন নোটিশ তৈরি'}</span>
            <button
              onClick={() => setEditingNotice(null)}
              className="text-xs text-slate-500 hover:text-slate-800 hover:underline"
            >
              বাতিল
            </button>
          </div>

          {/* 2-Field Title Entry Section */}
          <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <span>নোটিশের শিরোনাম (Title - বাংলা ও ইংরেজি ইনপুট)</span>
                <span className="text-red-500 font-bold">*</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>আরবি অনুবাদ ও সংরক্ষণ স্বয়ংক্রিয়ভাবে হবে (Auto-Translated)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-slate-800">১. শিরোনাম (বাংলা) *</label>
                <input
                  type="text"
                  placeholder="যেমন: নতুন শিক্ষাবর্ষের ভর্তি কার্যক্রম সংক্রান্ত জরুরি বিজ্ঞপ্তি"
                  value={editingNotice.title?.bn || ''}
                  onChange={e => {
                    setEditingNotice({ ...editingNotice, title: { bn: e.target.value, en: editingNotice.title?.en || '', ar: editingNotice.title?.ar || '' } });
                    if (formErrors.titleBn) setFormErrors(prev => ({ ...prev, titleBn: '' }));
                  }}
                  className={`w-full p-2.5 rounded-xl border ${formErrors.titleBn ? 'border-red-500 bg-red-50/30' : 'border-amber-300 bg-white'} focus:ring-2 focus:ring-amber-500 outline-none`}
                />
                {formErrors.titleBn && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold">{formErrors.titleBn}</p>
                )}
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-800">২. Title (English) *</label>
                <input
                  type="text"
                  placeholder="e.g. Urgent Notice Regarding Admission Session"
                  value={editingNotice.title?.en || ''}
                  onChange={e => {
                    setEditingNotice({ ...editingNotice, title: { bn: editingNotice.title?.bn || '', en: e.target.value, ar: editingNotice.title?.ar || '' } });
                    if (formErrors.titleEn) setFormErrors(prev => ({ ...prev, titleEn: '' }));
                  }}
                  className={`w-full p-2.5 rounded-xl border ${formErrors.titleEn ? 'border-red-500 bg-red-50/30' : 'border-amber-300 bg-white'} focus:ring-2 focus:ring-amber-500 outline-none`}
                />
                {formErrors.titleEn && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold">{formErrors.titleEn}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block font-semibold mb-1 text-slate-800">ক্যাটাগরি</label>
              <select
                value={editingNotice.category || 'general'}
                onChange={e => setEditingNotice({ ...editingNotice, category: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-amber-300 bg-white font-medium"
              >
                <option value="general">সাধারণ বিজ্ঞপ্তি (General)</option>
                <option value="admission">ভর্তি সংক্রান্ত (Admission)</option>
                <option value="exam">পরীক্ষা সংক্রান্ত (Exam)</option>
                <option value="event">অনুষ্ঠান ও ছুটি (Event)</option>
                <option value="urgent">জরুরি বিজ্ঞপ্তি (Urgent)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-800">প্রকাশের তারিখ</label>
              <input
                type="date"
                value={editingNotice.date || ''}
                onChange={e => setEditingNotice({ ...editingNotice, date: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-amber-300 bg-white font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="pinned-notice-toggle-check"
                checked={!!editingNotice.isPinned}
                onChange={e => setEditingNotice({ ...editingNotice, isPinned: e.target.checked })}
                className="w-4 h-4 accent-amber-700 cursor-pointer"
              />
              <label htmlFor="pinned-notice-toggle-check" className="font-semibold text-slate-800 cursor-pointer select-none">
                শীর্ষে পিন করে রাখুন (Pin to Top)
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-800">নোটিশের মূল বক্তব্য / বিবরণ (বাংলা) *</label>
            <textarea
              rows={4}
              placeholder="নোটিশের বিস্তারিত বক্তব্য, নির্দেশনা ও নিয়মাবলী লিখুন..."
              value={editingNotice.description?.bn || ''}
              onChange={e => {
                setEditingNotice({ ...editingNotice, description: { bn: e.target.value, en: editingNotice.description?.en || '', ar: editingNotice.description?.ar || '' } });
                if (formErrors.descriptionBn) setFormErrors(prev => ({ ...prev, descriptionBn: '' }));
              }}
              className={`w-full p-2.5 rounded-xl border ${formErrors.descriptionBn ? 'border-red-500 bg-red-50/30' : 'border-amber-300 bg-white'}`}
            />
            {formErrors.descriptionBn && (
              <p className="text-[11px] text-red-600 mt-1 font-semibold">{formErrors.descriptionBn}</p>
            )}
          </div>

          <div>
            <FileUpload
              id="notice-attachment-file-upload-admin"
              value={editingNotice.attachmentUrl || ''}
              onChange={(fileUrl, meta) => {
                setEditingNotice({
                  ...editingNotice,
                  attachmentUrl: fileUrl,
                  attachmentName: meta?.originalName || 'নোটিশ সার্কুলার ফাইল'
                });
              }}
              label="সংযুক্তি ফাইল আপলোড (Upload Notice Circular PDF/Document)"
              helperText="নোটিশের অফিসিয়াল সার্কুলার PDF বা ছবি থাকলে আপলোড করুন"
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setEditingNotice(null)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-semibold text-xs text-slate-800 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              onClick={() => handleSaveNotice(editingNotice)}
              className="px-5 py-2 bg-amber-800 hover:bg-amber-700 rounded-xl font-bold text-xs text-white shadow-sm cursor-pointer"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="নোটিশ খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs outline-none"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'সব' },
            { id: 'urgent', label: 'জরুরি' },
            { id: 'admission', label: 'ভর্তি' },
            { id: 'exam', label: 'পরীক্ষা' },
            { id: 'event', label: 'ছুটি' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-amber-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {filteredNotices.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            কোনো নোটিশ পাওয়া যায়নি।
          </div>
        ) : (
          filteredNotices.map(notice => (
            <div
              key={notice.id}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                notice.isPinned
                  ? 'border-amber-400 bg-amber-50/40'
                  : 'border-slate-200 bg-white hover:border-amber-300'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  onClick={() => togglePin(notice.id, !!notice.isPinned)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer flex-shrink-0 ${
                    notice.isPinned
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-amber-700'
                  }`}
                  title={notice.isPinned ? 'পিন অপসারণ করুন' : 'শীর্ষে পিন করুন'}
                >
                  <Pin className="w-4 h-4" />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded uppercase">
                      {notice.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {notice.date}
                    </span>
                    {notice.attachmentUrl && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        সংযুক্তি
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-1 truncate">
                    {getLocalized(notice.title, language)}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {getLocalized(notice.description, language)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <button
                  onClick={() => setSelectedNotice(notice)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition-colors cursor-pointer"
                  title="প্রিভিউ দেখুন"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingNotice(notice)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition-colors cursor-pointer"
                  title="সম্পাদনা"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteNotice(notice)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="নোটিশ মুছে ফেলা"
        itemName={deleteTarget?.title?.bn}
        message="আপনি কি নিশ্চিতভাবে এই নোটিশটি মুছে ফেলতে চান? এটি মুছে ফেললে ওয়েবসাইট এবং আর্কাইভ থেকে অপসারিত হবে।"
        onConfirm={confirmDeleteNotice}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
