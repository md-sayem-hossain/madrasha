import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useMadrasa } from '../../../context/MadrasaContext';
import { Teacher } from '../../../types';
import { getLocalized, toLocal } from '../../../i18n/translations';
import { ImageUpload } from '../ImageUpload';
import { hasPermission } from '../../../lib/security';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

export const TeachersManager: React.FC = () => {
  const { data, updateData, currentUser, addActivityLog, language } = useMadrasa();
  const [editingTeacher, setEditingTeacher] = useState<Partial<Teacher> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);

  const canManage = hasPermission(currentUser, 'manage_teachers');

  if (!canManage) {
    return (
      <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-950">অনুমতি নেই (Access Restricted)</h3>
        <p className="text-xs text-amber-800 mt-1">
          আপনার অ্যাকাউন্টে শিক্ষকমণ্ডলীর তালিকা পরিচালনার অনুমতি (manage_teachers) নেই।
        </p>
      </div>
    );
  }

  const handleSaveTeacher = (t: Partial<Teacher>) => {
    if (!t.name?.bn) {
      alert('শিক্ষকের নাম দেওয়া আবশ্যক।');
      return;
    }

    const newId = t.id || `teacher-${Date.now()}`;
    const cleanTeacher: Teacher = {
      id: newId,
      name: t.name ? toLocal(t.name.bn, t.name.en, t.name.ar) : toLocal(''),
      designation: t.designation ? toLocal(t.designation.bn, t.designation.en, t.designation.ar) : toLocal('উস্তাদ'),
      department: t.department ? toLocal(t.department.bn, t.department.en, t.department.ar) : toLocal('হিফজুল কুরআন বিভাগ'),
      subject: t.subject ? toLocal(t.subject.bn, t.subject.en, t.subject.ar) : toLocal('কুরআন মাজিদ ও তাজবিদ'),
      qualifications: t.qualifications ? toLocal(t.qualifications.bn, t.qualifications.en, t.qualifications.ar) : toLocal('দাওরায়ে হাদিস'),
      experience: t.experience ? toLocal(t.experience.bn, t.experience.en, t.experience.ar) : toLocal('৫ বছর'),
      biography: t.biography ? toLocal(t.biography.bn, t.biography.en, t.biography.ar) : toLocal(''),
      address: t.address ? toLocal(t.address.bn, t.address.en, t.address.ar) : toLocal('সন্দ্বীপ, চট্টগ্রাম'),
      joiningDate: t.joiningDate || '২০২০',
      image: t.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      phone: t.phone || '',
      email: t.email || '',
      isActive: t.isActive ?? true,
      order: t.order || data.teachers.length + 1
    };

    updateData(prev => {
      const exists = prev.teachers.some(item => item.id === cleanTeacher.id);
      const teachers = exists
        ? prev.teachers.map(item => item.id === cleanTeacher.id ? cleanTeacher : item)
        : [...prev.teachers, cleanTeacher];
      return { ...prev, teachers };
    });

    addActivityLog(
      t.id ? 'শিক্ষক তথ্য আপডেট' : 'নতুন শিক্ষক যোগ',
      cleanTeacher.name.bn,
      `পদবী: ${cleanTeacher.designation.bn}`
    );

    setEditingTeacher(null);
  };

  const handleDeleteTeacher = (teacher: Teacher) => {
    setDeleteTarget(teacher);
  };

  const confirmDeleteTeacher = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const targetTitle = deleteTarget.name?.bn || 'শিক্ষক';

    updateData(prev => ({
      ...prev,
      teachers: prev.teachers.filter(t => t.id !== id)
    }));

    addActivityLog('শিক্ষক মুছে ফেলা', targetTitle, `আইডি: ${id}`);
    setDeleteTarget(null);
  };

  const filteredTeachers = data.teachers.filter(t => {
    const matchSearch = (t.name.bn + t.designation.bn + (t.phone || '')).toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    if (selectedDept !== 'all' && t.department.bn !== selectedDept) return false;
    return true;
  });

  return (
    <div className="space-y-6" id="teachers-manager-cms">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">সম্মানিত শিক্ষকমণ্ডলী ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500">
            উস্তাদগণের প্রোফাইল, বিষয়, শিক্ষাগত যোগ্যতা ও যোগাযোগের তথ্য পরিচালনা করুন।
          </p>
        </div>
        <button
          onClick={() =>
            setEditingTeacher({
              name: { bn: '', en: '', ar: '' },
              designation: { bn: 'মুহাদ্দিস ও সিনিয়র শিক্ষক', en: 'Senior Teacher', ar: 'أستاذ أول' },
              department: { bn: 'কিতাব ও হাদিস বিভাগ', en: 'Kitab & Hadith Dept', ar: 'قسم الحديث والكتب' },
              subject: { bn: 'সহীহ বুখারী ও তাফসীর', en: 'Sahih Bukhari & Tafseer', ar: 'صحيح البخاري والتفسير' },
              qualifications: { bn: 'দাওরায়ে হাদিস ও ইফতা', en: 'Dawra-e-Hadith & Ifta', ar: 'دورة الحديث والإفتاء' },
              experience: { bn: '৮ বছর', en: '8 Years', ar: '٨ سنوات' },
              biography: { bn: '', en: '', ar: '' },
              address: { bn: 'সন্দ্বীপ, চট্টগ্রাম', en: 'Sandwip, Chittagong', ar: 'ساندويب' },
              joiningDate: '২০১৮',
              image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
              isActive: true
            })
          }
          className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন শিক্ষক যোগ করুন</span>
        </button>
      </div>

      {/* Inline Editor */}
      {editingTeacher && (
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-800" />
              <span>{editingTeacher.id ? 'শিক্ষক প্রোফাইল সম্পাদনা' : 'নতুন শিক্ষক যোগ'}</span>
            </h3>
            <button
              onClick={() => setEditingTeacher(null)}
              className="text-slate-500 hover:text-slate-800 font-semibold"
            >
              বাতিল
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700">শিক্ষকের নাম (বাংলা) *</label>
              <input
                type="text"
                value={editingTeacher.name?.bn || ''}
                onChange={e => setEditingTeacher({ ...editingTeacher, name: { bn: e.target.value, en: editingTeacher.name?.en || '', ar: editingTeacher.name?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">পদবী (বাংলা)</label>
              <input
                type="text"
                value={editingTeacher.designation?.bn || ''}
                onChange={e => setEditingTeacher({ ...editingTeacher, designation: { bn: e.target.value, en: editingTeacher.designation?.en || '', ar: editingTeacher.designation?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">বিভাগ (বাংলা)</label>
              <input
                type="text"
                value={editingTeacher.department?.bn || ''}
                onChange={e => setEditingTeacher({ ...editingTeacher, department: { bn: e.target.value, en: editingTeacher.department?.en || '', ar: editingTeacher.department?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700">পাঠদানের বিষয় (বাংলা)</label>
              <input
                type="text"
                value={editingTeacher.subject?.bn || ''}
                onChange={e => setEditingTeacher({ ...editingTeacher, subject: { bn: e.target.value, en: editingTeacher.subject?.en || '', ar: editingTeacher.subject?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">শিক্ষাগত যোগ্যতা (বাংলা)</label>
              <input
                type="text"
                value={editingTeacher.qualifications?.bn || ''}
                onChange={e => setEditingTeacher({ ...editingTeacher, qualifications: { bn: e.target.value, en: editingTeacher.qualifications?.en || '', ar: editingTeacher.qualifications?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">অভিজ্ঞতা (বাংলা)</label>
              <input
                type="text"
                value={editingTeacher.experience?.bn || ''}
                onChange={e => setEditingTeacher({ ...editingTeacher, experience: { bn: e.target.value, en: editingTeacher.experience?.en || '', ar: editingTeacher.experience?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700">যোগদানের সাল</label>
              <input
                type="text"
                value={editingTeacher.joiningDate || ''}
                onChange={e => setEditingTeacher({ ...editingTeacher, joiningDate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">মোবাইল নম্বর (ঐচ্ছিক)</label>
              <input
                type="text"
                value={editingTeacher.phone || ''}
                onChange={e => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">ইমেইল (ঐচ্ছিক)</label>
              <input
                type="email"
                value={editingTeacher.email || ''}
                onChange={e => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700">সংক্ষিপ্ত জীবনী / বিবরণ</label>
            <textarea
              rows={2}
              value={editingTeacher.biography?.bn || ''}
              onChange={e => setEditingTeacher({ ...editingTeacher, biography: { bn: e.target.value, en: editingTeacher.biography?.en || '', ar: editingTeacher.biography?.ar || '' } })}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            />
          </div>

          {/* Image Upload Component */}
          <div>
            <ImageUpload
              id="teacher-photo-upload"
              value={editingTeacher.image || ''}
              onChange={img => setEditingTeacher({ ...editingTeacher, image: img })}
              label="শিক্ষকের ছবি (Image Upload / Selection)"
              previewHeight="h-32"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingTeacher(null)}
              className="px-4 py-2 bg-slate-200 rounded-xl font-semibold text-slate-700"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={() => handleSaveTeacher(editingTeacher)}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="শিক্ষকের নাম, পদবী বা ফোন দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs outline-none"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold self-end sm:self-auto">
          মোট শিক্ষক: {filteredTeachers.length} জন
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeachers.map(teacher => (
          <div
            key={teacher.id}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex gap-3 text-xs"
          >
            <img
              src={teacher.image}
              alt={teacher.name.bn}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {getLocalized(teacher.name, language)}
                  </h4>
                  <p className="text-emerald-800 font-semibold text-[11px]">
                    {getLocalized(teacher.designation, language)}
                  </p>
                  <p className="text-slate-500 text-[10px]">
                    {getLocalized(teacher.department, language)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingTeacher(teacher)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800"
                    title="সম্পাদনা"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeacher(teacher)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-[10px] mt-2 font-medium">
                <span>বিষয়: {getLocalized(teacher.subject, language)}</span>
                <span>•</span>
                <span>অভিজ্ঞতা: {getLocalized(teacher.experience, language)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="শিক্ষক তথ্য মুছে ফেলা"
        itemName={deleteTarget?.name?.bn}
        message="আপনি কি নিশ্চিতভাবে এই সম্মানিত উস্তাদের তথ্য মুছে ফেলতে চান? এটি মুছে ফেললে শিক্ষক তালিকা থেকে অপসারিত হবে।"
        onConfirm={confirmDeleteTeacher}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
