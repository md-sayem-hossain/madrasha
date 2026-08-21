import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Clock,
  MapPin,
  CheckCircle,
  Search,
  AlertTriangle,
  Users
} from 'lucide-react';
import { useMadrasa } from '../../../context/MadrasaContext';
import { EventItem } from '../../../types';
import { getLocalized } from '../../../lib/translations';
import { ImageUpload } from '../ImageUpload';
import { hasPermission } from '../../../lib/security';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

export const EventsManager: React.FC = () => {
  const { data, updateData, currentUser, addActivityLog, language } = useMadrasa();
  const [editingEvent, setEditingEvent] = useState<Partial<EventItem> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);

  const canManage = hasPermission(currentUser, 'manage_events');

  if (!canManage) {
    return (
      <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-950">অনুমতি নেই (Access Restricted)</h3>
        <p className="text-xs text-amber-800 mt-1">
          আপনার অ্যাকাউন্টে ইভেন্ট ও মাহফিল পরিচালনার অনুমতি (manage_events) যুক্ত করা হয়নি।
        </p>
      </div>
    );
  }

  const handleSaveEvent = (ev: Partial<EventItem>) => {
    if (!ev.title?.bn) {
      alert('ইভেন্টের নাম (বাংলা) আবশ্যক');
      return;
    }

    const newId = ev.id || `event-${Date.now()}`;
    const cleanEvent: EventItem = {
      id: newId,
      title: {
        bn: ev.title?.bn || '',
        en: ev.title?.en || ev.title?.bn || '',
        ar: ev.title?.ar || ev.title?.bn || ''
      },
      description: {
        bn: ev.description?.bn || '',
        en: ev.description?.en || ev.description?.bn || '',
        ar: ev.description?.ar || ev.description?.bn || ''
      },
      date: ev.date || new Date().toISOString().split('T')[0],
      time: ev.time || 'সকাল ১০:০০ ঘটিকা',
      location: {
        bn: ev.location?.bn || 'মাদ্রাসা অডিটোরিয়াম',
        en: ev.location?.en || 'Madrasa Auditorium',
        ar: ev.location?.ar || 'فناء المدرسة'
      },
      image: ev.image || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
      isUpcoming: ev.isUpcoming !== false,
      isPublished: ev.isPublished !== false,
      guestSpeakers: ev.guestSpeakers || []
    };

    updateData(prev => {
      const exists = prev.events.some(e => e.id === cleanEvent.id);
      const events = exists
        ? prev.events.map(e => e.id === cleanEvent.id ? cleanEvent : e)
        : [cleanEvent, ...prev.events];
      return { ...prev, events };
    });

    addActivityLog(
      ev.id ? 'ইভেন্ট সম্পাদন' : 'নতুন ইভেন্ট তৈরি',
      cleanEvent.title.bn,
      `তারিখ: ${cleanEvent.date}, সময়: ${cleanEvent.time}`
    );

    setEditingEvent(null);
  };

  const handleDeleteEvent = (event: EventItem) => {
    setDeleteTarget(event);
  };

  const confirmDeleteEvent = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const targetTitle = deleteTarget.title?.bn || 'ইভেন্ট';

    updateData(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== id)
    }));

    addActivityLog('ইভেন্ট মুছে ফেলা', targetTitle, `ইভেন্ট আইডি: ${id}`);
    setDeleteTarget(null);
  };

  const filteredEvents = data.events.filter(e => {
    const titleMatch = (e.title?.bn + e.title?.en).toLowerCase().includes(searchQuery.toLowerCase());
    if (!titleMatch) return false;
    if (filterType === 'upcoming') return e.isUpcoming;
    if (filterType === 'completed') return !e.isUpcoming;
    return true;
  });

  return (
    <div className="space-y-6" id="events-manager-cms">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">ইভেন্ট ও মাহফিল ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500">
            আসন্ন ওয়াজ মাহফিল, বার্ষিক দস্তারবন্দী সম্মেলন ও বিশেষ অনুষ্ঠান প্রকাশ করুন।
          </p>
        </div>
        <button
          onClick={() =>
            setEditingEvent({
              title: { bn: '', en: '', ar: '' },
              description: { bn: '', en: '', ar: '' },
              date: new Date().toISOString().split('T')[0],
              time: 'সকাল ১০:০০ ঘটিকা',
              location: { bn: 'মাদ্রাসা অডিটোরিয়াম ও মাঠ প্রাঙ্গণ', en: 'Madrasa Auditorium Ground', ar: 'فناء المدرسة' },
              image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
              isUpcoming: true,
              isPublished: true
            })
          }
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ইভেন্ট যোগ করুন</span>
        </button>
      </div>

      {/* Editor Modal / Inline Form */}
      {editingEvent && (
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 text-xs sm:text-sm animate-in fade-in duration-150">
          <div className="font-bold text-emerald-950 flex items-center justify-between border-b border-emerald-200 pb-2">
            <span>{editingEvent.id ? 'ইভেন্ট তথ্য সম্পাদনা' : 'নতুন ইভেন্ট তৈরি'}</span>
            <button
              onClick={() => setEditingEvent(null)}
              className="text-xs text-slate-500 hover:text-slate-800 hover:underline"
            >
              বাতিল
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-800">ইভেন্টের নাম / শিরোনাম (বাংলা) *</label>
              <input
                type="text"
                placeholder="যেমন: বার্ষিক ইসলামী সম্মেলন ও ওয়াজ মাহফিল"
                value={editingEvent.title?.bn || ''}
                onChange={e => setEditingEvent({ ...editingEvent, title: { bn: e.target.value, en: editingEvent.title?.en || '', ar: editingEvent.title?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-800">ইভেন্টের নাম (English)</label>
              <input
                type="text"
                placeholder="e.g. Annual Islamic Conference"
                value={editingEvent.title?.en || ''}
                onChange={e => setEditingEvent({ ...editingEvent, title: { bn: editingEvent.title?.bn || '', en: e.target.value, ar: editingEvent.title?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-800">তারিখ (Event Date)</label>
              <input
                type="date"
                value={editingEvent.date || ''}
                onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-800">সময় (Time)</label>
              <input
                type="text"
                placeholder="যেমন: সকাল ১০:০০ - রাত ১০:০০"
                value={editingEvent.time || ''}
                onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="event-is-upcoming"
                checked={editingEvent.isUpcoming !== false}
                onChange={e => setEditingEvent({ ...editingEvent, isUpcoming: e.target.checked })}
                className="w-4 h-4 accent-emerald-700 cursor-pointer"
              />
              <label htmlFor="event-is-upcoming" className="font-semibold text-slate-800 cursor-pointer select-none">
                আসন্ন ইভেন্ট (Upcoming Event)
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-800">স্থান / ভেন্যু (বাংলা)</label>
            <input
              type="text"
              placeholder="যেমন: মাদ্রাসা অডিটোরিয়াম ও মাঠ প্রাঙ্গণ"
              value={editingEvent.location?.bn || ''}
              onChange={e => setEditingEvent({ ...editingEvent, location: { bn: e.target.value, en: editingEvent.location?.en || '', ar: editingEvent.location?.ar || '' } })}
              className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white"
            />
          </div>

          <div>
            <ImageUpload
              id="event-banner-image-upload"
              value={editingEvent.image || ''}
              onChange={img => setEditingEvent({ ...editingEvent, image: img })}
              label="ইভেন্টের ব্যানার বা পোস্টার ছবি আপলোড (Upload Event Banner)"
              helperText="অনুষ্ঠানের পোস্টার বা ব্যানার ছবি (JPG, PNG, WEBP)"
              previewHeight="h-32"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-800">বিস্তারিত বিবরণ ও আলোচকদের সূচি</label>
            <textarea
              rows={3}
              placeholder="অনুষ্ঠানের বিস্তারিত বিবরণ, প্রধান অতিথি, বিশেষ আলোচক ও বিষয়সূচি..."
              value={editingEvent.description?.bn || ''}
              onChange={e => setEditingEvent({ ...editingEvent, description: { bn: e.target.value, en: editingEvent.description?.en || '', ar: editingEvent.description?.ar || '' } })}
              className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setEditingEvent(null)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-semibold text-xs text-slate-800 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              onClick={() => handleSaveEvent(editingEvent)}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 rounded-xl font-bold text-xs text-white shadow-sm cursor-pointer"
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
            placeholder="ইভেন্ট খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs outline-none"
          />
        </div>
        <div className="flex items-center gap-1 self-start sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${filterType === 'all' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
          >
            সব ({data.events.length})
          </button>
          <button
            onClick={() => setFilterType('upcoming')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${filterType === 'upcoming' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
          >
            আসন্ন ({data.events.filter(e => e.isUpcoming).length})
          </button>
          <button
            onClick={() => setFilterType('completed')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${filterType === 'completed' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
          >
            সম্পন্ন ({data.events.filter(e => !e.isUpcoming).length})
          </button>
        </div>
      </div>

      {/* Event Cards List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            কোনো ইভেন্ট পাওয়া যায়নি।
          </div>
        ) : (
          filteredEvents.map(ev => (
            <div
              key={ev.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={ev.image}
                  alt={getLocalized(ev.title, language)}
                  className="w-16 h-14 rounded-xl object-cover border border-emerald-300 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400';
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ev.isUpcoming
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ev.isUpcoming ? 'আসন্ন ইভেন্ট' : 'সম্পন্ন ইভেন্ট'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {ev.date}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      • {ev.time}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1 truncate">
                    {getLocalized(ev.title, language)}
                  </h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {getLocalized(ev.location, language)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                <button
                  onClick={() => setEditingEvent(ev)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
                  title="সম্পাদনা"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteEvent(ev)}
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
        title="ইভেন্ট মুছে ফেলা"
        itemName={deleteTarget?.title?.bn}
        message="আপনি কি নিশ্চিতভাবে এই ইভেন্টটি মুছে ফেলতে চান? এটি মুছে ফেললে ওয়েবসাইট থেকে স্থায়ীভাবে অপসারিত হবে।"
        onConfirm={confirmDeleteEvent}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
