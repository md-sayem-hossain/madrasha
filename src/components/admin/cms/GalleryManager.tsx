import React, { useState } from 'react';
import {
  Image,
  Plus,
  Trash2,
  Edit2,
  Star,
  Search,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { useMadrasa } from '../../../context/MadrasaContext';
import { GalleryItem } from '../../../types';
import { getLocalized } from '../../../lib/translations';
import { ImageUpload } from '../ImageUpload';
import { hasPermission } from '../../../lib/security';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

export const GalleryManager: React.FC = () => {
  const { data, updateData, currentUser, addActivityLog, language, setGalleryLightboxIndex } = useMadrasa();
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryItem> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  const canManage = hasPermission(currentUser, 'manage_gallery');

  if (!canManage) {
    return (
      <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-950">অনুমতি নেই (Access Restricted)</h3>
        <p className="text-xs text-amber-800 mt-1">
          আপনার অ্যাকাউন্টে ফটো গ্যালারি পরিচালনার অনুমতি (manage_gallery) নেই।
        </p>
      </div>
    );
  }

  const handleSaveGallery = (item: Partial<GalleryItem>) => {
    if (!item.title?.bn || !item.imageUrl) {
      alert('ছবির শিরোনাম এবং ছবি আপলোড করা আবশ্যক।');
      return;
    }

    const newId = item.id || `gallery-${Date.now()}`;
    const cleanItem: GalleryItem = {
      id: newId,
      title: {
        bn: item.title?.bn || '',
        en: item.title?.en || item.title?.bn || '',
        ar: item.title?.ar || item.title?.bn || ''
      },
      category: item.category || 'campus',
      imageUrl: item.imageUrl,
      description: item.description,
      date: item.date || new Date().toISOString().split('T')[0],
      isFeatured: !!item.isFeatured,
      order: item.order || data.gallery.length + 1
    };

    updateData(prev => {
      const exists = prev.gallery.some(g => g.id === cleanItem.id);
      const gallery = exists
        ? prev.gallery.map(g => g.id === cleanItem.id ? cleanItem : g)
        : [cleanItem, ...prev.gallery];
      return { ...prev, gallery };
    });

    addActivityLog(
      item.id ? 'গ্যালারি ছবি সম্পাদন' : 'নতুন ছবি আপলোড',
      cleanItem.title.bn,
      `ক্যাটাগরি: ${cleanItem.category}, ফিচার্ড: ${cleanItem.isFeatured ? 'হ্যাঁ' : 'না'}`
    );

    setEditingGallery(null);
  };

  const handleDeleteGallery = (item: GalleryItem) => {
    setDeleteTarget(item);
  };

  const confirmDeleteGallery = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const targetTitle = deleteTarget.title?.bn || 'ছবি';

    updateData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(g => g.id !== id)
    }));

    addActivityLog('গ্যালারি ছবি মুছে ফেলা', targetTitle, `আইডি: ${id}`);
    setDeleteTarget(null);
  };

  const filteredGallery = data.gallery.filter(g => {
    const matchQuery = (g.title?.bn + g.title?.en).toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchQuery) return false;
    if (categoryFilter !== 'all' && g.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6" id="gallery-manager-cms">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">ফটো গ্যালারি অ্যালবাম ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500">
            মাদ্রাসার ক্যাম্পাস, শিক্ষক, ছাত্র ও অনুষ্ঠানের ছবি আপলোড ও ক্যাটাগরি অনুসারে সাজান।
          </p>
        </div>
        <button
          onClick={() =>
            setEditingGallery({
              title: { bn: '', en: '', ar: '' },
              category: 'campus',
              imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
              date: new Date().toISOString().split('T')[0],
              isFeatured: true,
              description: { bn: '', en: '', ar: '' }
            })
          }
          className="px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ছবি আপলোড করুন</span>
        </button>
      </div>

      {/* Gallery Editor Form */}
      {editingGallery && (
        <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-4 text-xs sm:text-sm animate-in fade-in duration-150">
          <div className="font-bold text-teal-950 flex items-center justify-between border-b border-teal-200 pb-2">
            <span>{editingGallery.id ? 'ছবি সম্পাদনা' : 'নতুন ছবি আপলোড'}</span>
            <button
              onClick={() => setEditingGallery(null)}
              className="text-xs text-slate-500 hover:text-slate-800 hover:underline"
            >
              বাতিল
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-800">ছবির ক্যাপশন / শিরোনাম (বাংলা) *</label>
              <input
                type="text"
                placeholder="যেমন: মাদ্রাসার মূল ভবন ও মনোরম ক্যাম্পাস"
                value={editingGallery.title?.bn || ''}
                onChange={e => setEditingGallery({ ...editingGallery, title: { bn: e.target.value, en: editingGallery.title?.en || '', ar: editingGallery.title?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-teal-300 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-800">ক্যাটাগরি</label>
              <select
                value={editingGallery.category || 'campus'}
                onChange={e => setEditingGallery({ ...editingGallery, category: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-teal-300 bg-white font-medium"
              >
                <option value="campus">ক্যাম্পাস ও পরিবেশ (Campus)</option>
                <option value="teachers">শিক্ষকমণ্ডলী (Teachers)</option>
                <option value="founders">প্রতিষ্ঠাতা ও মেহমান (Founders)</option>
                <option value="events">অনুষ্ঠান ও মাহফিল (Events)</option>
                <option value="students">ছাত্র ও শ্রেণি কার্যক্রম (Students)</option>
                <option value="programs">পুরস্কার ও প্রতিযোগিতা (Programs)</option>
                <option value="religious">সালাত ও ইবাদত (Religious)</option>
              </select>
            </div>
          </div>

          <div>
            <ImageUpload
              id="gallery-photo-image-upload"
              value={editingGallery.imageUrl || ''}
              onChange={img => setEditingGallery({ ...editingGallery, imageUrl: img })}
              label="গ্যালারি ছবি নির্বাচন / আপলোড (Upload Gallery Photo) *"
              helperText="এইচডি কোয়ালিটির ছবি নির্বাচন করুন (সর্বোচ্চ ৫ MB)"
              previewHeight="h-36"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block font-semibold mb-1 text-slate-800">তারিখ</label>
              <input
                type="date"
                value={editingGallery.date || ''}
                onChange={e => setEditingGallery({ ...editingGallery, date: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-teal-300 bg-white font-mono"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="featured-gallery-item-checkbox"
                checked={!!editingGallery.isFeatured}
                onChange={e => setEditingGallery({ ...editingGallery, isFeatured: e.target.checked })}
                className="w-4 h-4 accent-teal-700 cursor-pointer"
              />
              <label htmlFor="featured-gallery-item-checkbox" className="font-semibold text-slate-800 cursor-pointer select-none">
                হোমপেজ ফিচার্ড ফটোতে প্রদর্শন করুন (Featured)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setEditingGallery(null)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-semibold text-xs text-slate-800 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              onClick={() => handleSaveGallery(editingGallery)}
              className="px-5 py-2 bg-teal-800 hover:bg-teal-700 rounded-xl font-bold text-xs text-white shadow-sm cursor-pointer"
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
            placeholder="ছবির নাম খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs outline-none"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'সব' },
            { id: 'campus', label: 'ক্যাম্পাস' },
            { id: 'teachers', label: 'শিক্ষক' },
            { id: 'students', label: 'ছাত্র' },
            { id: 'events', label: 'অনুষ্ঠান' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-teal-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGallery.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            কোনো ছবি পাওয়া যায়নি।
          </div>
        ) : (
          filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              className="p-2.5 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 space-y-2 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div
                  onClick={() => setGalleryLightboxIndex(idx)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={getLocalized(item.title, language)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400';
                    }}
                  />
                  {item.isFeatured && (
                    <div className="absolute top-1.5 right-1.5 bg-amber-500 text-white rounded-full p-1 shadow-xs" title="হোমপেজ ফিচার্ড ফটো">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}
                  <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    {item.category}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs truncate">
                  {getLocalized(item.title, language)}
                </h4>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingGallery(item)}
                    className="p-1 rounded-md bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-800 transition-colors cursor-pointer"
                    title="সম্পাদনা"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteGallery(item)}
                    className="p-1 rounded-md bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 transition-colors cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="গ্যালারি ছবি মুছে ফেলা"
        itemName={deleteTarget?.title?.bn}
        message="আপনি কি নিশ্চিতভাবে এই ছবিটি মুছে ফেলতে চান? এটি মুছে ফেললে ফটো গ্যালারি থেকে স্থায়ীভাবে অপসারিত হবে।"
        onConfirm={confirmDeleteGallery}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
