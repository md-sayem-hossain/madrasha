import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useMadrasa } from '../../../context/MadrasaContext';
import { HistoryMilestone, HistoryContent } from '../../../types';
import { getLocalized, toLocal } from '../../../i18n/translations';
import { ImageUpload } from '../ImageUpload';
import { hasPermission } from '../../../lib/security';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

export const HistoryManager: React.FC = () => {
  const { data, updateData, currentUser, addActivityLog, language } = useMadrasa();
  const [editingMilestone, setEditingMilestone] = useState<Partial<HistoryMilestone> | null>(null);
  const [historyForm, setHistoryForm] = useState<HistoryContent>(data.history);
  const [deleteTarget, setDeleteTarget] = useState<HistoryMilestone | null>(null);

  const canManage = hasPermission(currentUser, 'manage_history');

  if (!canManage) {
    return (
      <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-950">অনুমতি নেই (Access Restricted)</h3>
        <p className="text-xs text-amber-800 mt-1">
          আপনার অ্যাকাউন্টে ইতিহাস ও ঐতিহাসিক মাইলফলক পরিচালনার অনুমতি (manage_history) নেই।
        </p>
      </div>
    );
  }

  const handleSaveGeneralHistory = () => {
    updateData(prev => ({
      ...prev,
      history: historyForm
    }));

    addActivityLog('ইতিহাস হালনাগাদ', 'প্রাতিষ্ঠানিক ইতিহাস', 'মাদ্রাসার পটভূমি ও ঐতিহাসিক তথ্য সংরক্ষণ করা হয়েছে।');
    alert('প্রাতিষ্ঠানিক ইতিহাস সফলভাবে সংরক্ষণ করা হয়েছে।');
  };

  const handleSaveMilestone = (ms: Partial<HistoryMilestone>) => {
    if (!ms.year || !ms.title?.bn) {
      alert('মাইলফলকের সাল এবং শিরোনাম আবশ্যক।');
      return;
    }

    const newId = ms.id || `ms-${Date.now()}`;
    const cleanMilestone: HistoryMilestone = {
      id: newId,
      year: ms.year,
      title: ms.title ? toLocal(ms.title.bn, ms.title.en, ms.title.ar) : toLocal(''),
      description: ms.description ? toLocal(ms.description.bn, ms.description.en, ms.description.ar) : toLocal(''),
      image: ms.image,
      order: ms.order || data.history.milestones.length + 1
    };

    updateData(prev => {
      const exists = prev.history.milestones.some(m => m.id === cleanMilestone.id);
      const milestones = exists
        ? prev.history.milestones.map(m => m.id === cleanMilestone.id ? cleanMilestone : m)
        : [...prev.history.milestones, cleanMilestone];
      return {
        ...prev,
        history: {
          ...prev.history,
          milestones
        }
      };
    });

    addActivityLog('মাইলফলক সংরক্ষণ', cleanMilestone.title.bn, `সাল: ${cleanMilestone.year}`);
    setEditingMilestone(null);
  };

  const handleDeleteMilestone = (milestone: HistoryMilestone) => {
    setDeleteTarget(milestone);
  };

  const confirmDeleteMilestone = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const targetTitle = deleteTarget.title?.bn || 'মাইলফলক';

    updateData(prev => ({
      ...prev,
      history: {
        ...prev.history,
        milestones: prev.history.milestones.filter(m => m.id !== id)
      }
    }));

    addActivityLog('মাইলফলক মুছে ফেলা', targetTitle, `আইডি: ${id}`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6" id="history-manager-cms">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">ইতিহাস ও ঐতিহ্যের মাইলফলক ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500">
            প্রতিষ্ঠানের গোড়াপত্তন, ঐতিহাসিক অগ্রযাত্রা, অর্জন ও পটভূমি সম্পাদনা করুন।
          </p>
        </div>
      </div>

      {/* General History Story */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-800" />
          <span>প্রাতিষ্ঠানিক পটভূমি ও ইতিহাস</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1 text-slate-700">মূল শিরোনাম (বাংলা)</label>
            <input
              type="text"
              value={historyForm.mainTitle?.bn || ''}
              onChange={e => setHistoryForm({ ...historyForm, mainTitle: { bn: e.target.value, en: historyForm.mainTitle?.en || '', ar: historyForm.mainTitle?.ar || '' } })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700">প্রতিষ্ঠার উদ্দেশ্য (বাংলা)</label>
            <input
              type="text"
              value={historyForm.purposeOfEstablishment?.bn || ''}
              onChange={e => setHistoryForm({ ...historyForm, purposeOfEstablishment: { bn: e.target.value, en: historyForm.purposeOfEstablishment?.en || '', ar: historyForm.purposeOfEstablishment?.ar || '' } })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-slate-700">প্রতিষ্ঠানের মূল ইতিহাস ও পটভূমি (বাংলা)</label>
          <textarea
            rows={4}
            value={historyForm.backgroundStory?.bn || ''}
            onChange={e => setHistoryForm({ ...historyForm, backgroundStory: { bn: e.target.value, en: historyForm.backgroundStory?.en || '', ar: historyForm.backgroundStory?.ar || '' } })}
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveGeneralHistory}
            className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold cursor-pointer"
          >
            ইতিহাস তথ্য সংরক্ষণ করুন
          </button>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-800" />
            <span>ঐতিহাসিক মাইলফলক সমূহ ({data.history.milestones.length})</span>
          </h3>
          <button
            onClick={() =>
              setEditingMilestone({
                year: '১৯৯০',
                title: { bn: '', en: '', ar: '' },
                description: { bn: '', en: '', ar: '' },
                image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600'
              })
            }
            className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন মাইলফলক যোগ</span>
          </button>
        </div>

        {/* Milestone Editor */}
        {editingMilestone && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 text-xs animate-in fade-in duration-150">
            <div className="font-bold text-emerald-950 flex items-center justify-between">
              <span>মাইলফলক সম্পাদন</span>
              <button onClick={() => setEditingMilestone(null)} className="text-slate-500 hover:underline">বাতিল</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700">সাল / বছর *</label>
                <input
                  type="text"
                  placeholder="যেমন: ১৯৮৫ বা ১৯৯২"
                  value={editingMilestone.year || ''}
                  onChange={e => setEditingMilestone({ ...editingMilestone, year: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-slate-700">মাইলফলকের শিরোনাম (বাংলা) *</label>
                <input
                  type="text"
                  placeholder="যেমন: হিফজখানা ও কিতাব বিভাগের শুভ উদ্বোধন"
                  value={editingMilestone.title?.bn || ''}
                  onChange={e => setEditingMilestone({ ...editingMilestone, title: { bn: e.target.value, en: editingMilestone.title?.en || '', ar: editingMilestone.title?.ar || '' } })}
                  className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700">সংক্ষিপ্ত বিবরণ</label>
              <textarea
                rows={2}
                value={editingMilestone.description?.bn || ''}
                onChange={e => setEditingMilestone({ ...editingMilestone, description: { bn: e.target.value, en: editingMilestone.description?.en || '', ar: editingMilestone.description?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white"
              />
            </div>

            <div>
              <ImageUpload
                id="milestone-photo-image-upload"
                value={editingMilestone.image || ''}
                onChange={img => setEditingMilestone({ ...editingMilestone, image: img })}
                label="মাইলফলক সম্পর্কিত ঐতিহাসিক ছবি (ঐচ্ছিক)"
                previewHeight="h-28"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingMilestone(null)}
                className="px-3 py-1.5 bg-slate-200 rounded-xl font-semibold"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleSaveMilestone(editingMilestone)}
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        )}

        {/* Milestones List */}
        <div className="space-y-2.5">
          {data.history.milestones.map(ms => (
            <div
              key={ms.id}
              className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-12 h-10 rounded-xl bg-emerald-100 text-emerald-900 font-bold font-mono flex items-center justify-center flex-shrink-0">
                  {ms.year}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">
                    {getLocalized(ms.title, language)}
                  </h4>
                  <p className="text-slate-500 line-clamp-1">
                    {getLocalized(ms.description, language)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingMilestone(ms)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700"
                  title="সম্পাদনা"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteMilestone(ms)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="মাইলফলক মুছে ফেলা"
        itemName={deleteTarget?.title?.bn}
        message="আপনি কি নিশ্চিতভাবে এই ঐতিহাসিক মাইলফলকটি মুছে ফেলতে চান? এটি মুছে ফেললে মাদ্রাসার ইতিহাস পাতা থেকে অপসারিত হবে।"
        onConfirm={confirmDeleteMilestone}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
