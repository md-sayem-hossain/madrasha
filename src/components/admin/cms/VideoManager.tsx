import React, { useState } from 'react';
import {
  Video,
  Plus,
  Trash2,
  Edit2,
  Play,
  Search,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { useMadrasa } from '../../../context/MadrasaContext';
import { VideoItem } from '../../../types';
import { getLocalized } from '../../../lib/translations';
import { ImageUpload } from '../ImageUpload';
import { hasPermission } from '../../../lib/security';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

export const VideoManager: React.FC = () => {
  const { data, updateData, currentUser, addActivityLog, language, setSelectedVideo } = useMadrasa();
  const [editingVideo, setEditingVideo] = useState<Partial<VideoItem> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<VideoItem | null>(null);

  const canManage = hasPermission(currentUser, 'manage_video');

  if (!canManage) {
    return (
      <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-950">অনুমতি নেই (Access Restricted)</h3>
        <p className="text-xs text-amber-800 mt-1">
          আপনার অ্যাকাউন্টে ভিডিও গ্যালারি পরিচালনার অনুমতি (manage_video) নেই।
        </p>
      </div>
    );
  }

  const handleSaveVideo = (video: Partial<VideoItem>) => {
    if (!video.title?.bn || !video.presenter?.bn || !video.videoUrl) {
      alert('ভিডিওর শিরোনাম, বক্তার নাম এবং ভিডিও লিংক আবশ্যক।');
      return;
    }

    const newId = video.id || `video-${Date.now()}`;
    const cleanVideo: VideoItem = {
      id: newId,
      title: {
        bn: video.title?.bn || '',
        en: video.title?.en || video.title?.bn || '',
        ar: video.title?.ar || video.title?.bn || ''
      },
      presenter: {
        bn: video.presenter?.bn || '',
        en: video.presenter?.en || video.presenter?.bn || '',
        ar: video.presenter?.ar || video.presenter?.bn || ''
      },
      category: video.category || 'waz',
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
      description: {
        bn: video.description?.bn || '',
        en: video.description?.en || video.description?.bn || '',
        ar: video.description?.ar || video.description?.bn || ''
      },
      date: video.date || new Date().toISOString().split('T')[0],
      isPublished: video.isPublished !== false
    };

    updateData(prev => {
      const exists = prev.videos.some(v => v.id === cleanVideo.id);
      const videos = exists
        ? prev.videos.map(v => v.id === cleanVideo.id ? cleanVideo : v)
        : [cleanVideo, ...prev.videos];
      return { ...prev, videos };
    });

    addActivityLog(
      video.id ? 'ভিডিও সম্পাদন' : 'নতুন ভিডিও যোগ',
      cleanVideo.title.bn,
      `বক্তা: ${cleanVideo.presenter.bn}, ক্যাটাগরি: ${cleanVideo.category}`
    );

    setEditingVideo(null);
  };

  const handleDeleteVideo = (video: VideoItem) => {
    setDeleteTarget(video);
  };

  const confirmDeleteVideo = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const targetTitle = deleteTarget.title?.bn || 'ভিডিও';

    updateData(prev => ({
      ...prev,
      videos: prev.videos.filter(v => v.id !== id)
    }));

    addActivityLog('ভিডিও মুছে ফেলা', targetTitle, `আইডি: ${id}`);
    setDeleteTarget(null);
  };

  const filteredVideos = data.videos.filter(v => {
    const matchQuery = (v.title?.bn + v.title?.en + v.presenter?.bn).toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchQuery) return false;
    if (categoryFilter !== 'all' && v.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6" id="video-manager-cms">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">ভিডিও গ্যালারি ও বয়ান ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500">
            ইউটিউব ও ভিডিও রেকর্ডিং, মাহফিলের ভিডিও এবং ডকুমেন্টারি সহজে পরিচালনা করুন।
          </p>
        </div>
        <button
          onClick={() =>
            setEditingVideo({
              title: { bn: '', en: '', ar: '' },
              presenter: { bn: '', en: '', ar: '' },
              category: 'waz',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              thumbnailUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
              date: new Date().toISOString().split('T')[0],
              description: { bn: '', en: '', ar: '' },
              isPublished: true
            })
          }
          className="px-4 py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ভিডিও যোগ করুন</span>
        </button>
      </div>

      {/* Video Editor Form */}
      {editingVideo && (
        <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200 space-y-4 text-xs sm:text-sm animate-in fade-in duration-150">
          <div className="font-bold text-red-950 flex items-center justify-between border-b border-red-200 pb-2">
            <span>{editingVideo.id ? 'ভিডিও সম্পাদনা' : 'নতুন ভিডিও যোগ'}</span>
            <button
              onClick={() => setEditingVideo(null)}
              className="text-xs text-slate-500 hover:text-slate-800 hover:underline"
            >
              বাতিল
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-800">ভিডিওর শিরোনাম (বাংলা) *</label>
              <input
                type="text"
                placeholder="যেমন: মাদ্রাসার বার্ষিক ইসলামী সম্মেলন ও বিশেষ বয়ান"
                value={editingVideo.title?.bn || ''}
                onChange={e => setEditingVideo({ ...editingVideo, title: { bn: e.target.value, en: editingVideo.title?.en || '', ar: editingVideo.title?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-red-300 bg-white focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-800">বক্তা / উপস্থাপক (বাংলা) *</label>
              <input
                type="text"
                placeholder="যেমন: শায়খুল হাদিস মুফতী..."
                value={editingVideo.presenter?.bn || ''}
                onChange={e => setEditingVideo({ ...editingVideo, presenter: { bn: e.target.value, en: editingVideo.presenter?.en || '', ar: editingVideo.presenter?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-red-300 bg-white focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-800">ক্যাটাগরি</label>
              <select
                value={editingVideo.category || 'waz'}
                onChange={e => setEditingVideo({ ...editingVideo, category: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-red-300 bg-white font-medium"
              >
                <option value="waz">ওয়াজ মাহফিল (Waz Mahfil)</option>
                <option value="lectures">দারস ও লেকচার (Lectures)</option>
                <option value="programs">অনুষ্ঠান ও প্রতিযোগিতা (Programs)</option>
                <option value="events">ইভেন্ট ভিডিও (Events)</option>
                <option value="documentary">ডকুমেন্টারি (Documentary)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1 text-slate-800">ভিডিও URL (YouTube বা ভিডিও লিংক) *</label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=... বা https://youtu.be/..."
                value={editingVideo.videoUrl || ''}
                onChange={e => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-red-300 bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <ImageUpload
              id="video-thumbnail-image-upload"
              value={editingVideo.thumbnailUrl || ''}
              onChange={img => setEditingVideo({ ...editingVideo, thumbnailUrl: img })}
              label="ভিডিও থাম্বনেইল ছবি আপলোড (Upload Video Thumbnail)"
              helperText="ভিডিওর কভার / থাম্বনেইল ফটো (JPG, PNG, WEBP)"
              previewHeight="h-32"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-800">সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)</label>
            <textarea
              rows={2}
              placeholder="ভিডিও সম্পর্কে সংক্ষিপ্ত তথ্য..."
              value={editingVideo.description?.bn || ''}
              onChange={e => setEditingVideo({ ...editingVideo, description: { bn: e.target.value, en: editingVideo.description?.en || '', ar: editingVideo.description?.ar || '' } })}
              className="w-full p-2.5 rounded-xl border border-red-300 bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setEditingVideo(null)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-semibold text-xs text-slate-800 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              onClick={() => handleSaveVideo(editingVideo)}
              className="px-5 py-2 bg-red-800 hover:bg-red-700 rounded-xl font-bold text-xs text-white shadow-sm cursor-pointer"
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
            placeholder="ভিডিও বা বক্তা খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs outline-none"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'সব' },
            { id: 'waz', label: 'ওয়াজ মাহফিল' },
            { id: 'lectures', label: 'লেকচার' },
            { id: 'programs', label: 'অনুষ্ঠান' },
            { id: 'documentary', label: 'ডকুমেন্টারি' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-red-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            কোনো ভিডিও পাওয়া যায়নি।
          </div>
        ) : (
          filteredVideos.map(video => (
            <div
              key={video.id}
              className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-red-300 space-y-3 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div
                  onClick={() => setSelectedVideo(video)}
                  className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 group cursor-pointer"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={getLocalized(video.title, language)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {video.category}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm line-clamp-2">
                  {getLocalized(video.title, language)}
                </h4>
                <p className="text-xs text-red-900 font-medium">
                  {getLocalized(video.presenter, language)}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-mono">{video.date}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingVideo(video)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-800 transition-colors cursor-pointer"
                    title="সম্পাদনা"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 transition-colors cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
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
        title="ভিডিও মুছে ফেলা"
        itemName={deleteTarget?.title?.bn}
        message="আপনি কি নিশ্চিতভাবে এই ভিডিওটি মুছে ফেলতে চান? এটি মুছে ফেললে ওয়েবসাইট থেকে অপসারিত হবে।"
        onConfirm={confirmDeleteVideo}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
