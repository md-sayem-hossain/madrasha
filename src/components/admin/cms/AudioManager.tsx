import React, { useState } from 'react';
import {
  Music,
  Plus,
  Trash2,
  Edit2,
  Play,
  Pause,
  Clock,
  Search,
  AlertTriangle,
  Headphones,
  FileAudio
} from 'lucide-react';
import { useMadrasa } from '../../../context/MadrasaContext';
import { AudioTrack } from '../../../types';
import { getLocalized } from '../../../lib/translations';
import { FileUpload } from '../FileUpload';
import { hasPermission } from '../../../lib/security';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

export const AudioManager: React.FC = () => {
  const {
    data,
    updateData,
    currentUser,
    addActivityLog,
    language,
    currentTrack,
    isPlayingAudio,
    playTrack,
    togglePlayAudio
  } = useMadrasa();

  const [editingAudio, setEditingAudio] = useState<Partial<AudioTrack> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<AudioTrack | null>(null);

  const canManage = hasPermission(currentUser, 'manage_audio');

  if (!canManage) {
    return (
      <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-950">অনুমতি নেই (Access Restricted)</h3>
        <p className="text-xs text-amber-800 mt-1">
          আপনার অ্যাকাউন্টে অডিও ও তিলাওয়াত পরিচালনার অনুমতি (manage_audio) যুক্ত করা হয়নি।
        </p>
      </div>
    );
  }

  const handleSaveAudio = (track: Partial<AudioTrack>) => {
    if (!track.title?.bn || !track.speaker?.bn || !track.audioUrl) {
      alert('অডিও শিরোনাম, বক্তা/কারী এবং অডিও ফাইল/লিংক আবশ্যক।');
      return;
    }

    const newId = track.id || `audio-${Date.now()}`;
    const cleanTrack: AudioTrack = {
      id: newId,
      title: {
        bn: track.title?.bn || '',
        en: track.title?.en || track.title?.bn || '',
        ar: track.title?.ar || track.title?.bn || ''
      },
      speaker: {
        bn: track.speaker?.bn || '',
        en: track.speaker?.en || track.speaker?.bn || '',
        ar: track.speaker?.ar || track.speaker?.bn || ''
      },
      category: track.category || 'quran',
      audioUrl: track.audioUrl,
      duration: track.duration || '০৫:০০',
      description: track.description,
      date: track.date || new Date().toISOString().split('T')[0],
      isPublished: track.isPublished !== false,
      playCount: track.playCount || 0
    };

    updateData(prev => {
      const exists = prev.audio.some(a => a.id === cleanTrack.id);
      const audio = exists
        ? prev.audio.map(a => a.id === cleanTrack.id ? cleanTrack : a)
        : [cleanTrack, ...prev.audio];
      return { ...prev, audio };
    });

    addActivityLog(
      track.id ? 'অডিও সম্পাদন' : 'নতুন অডিও যোগ',
      cleanTrack.title.bn,
      `বক্তা/কারী: ${cleanTrack.speaker.bn}, ক্যাটাগরি: ${cleanTrack.category}`
    );

    setEditingAudio(null);
  };

  const handleDeleteAudio = (track: AudioTrack) => {
    setDeleteTarget(track);
  };

  const confirmDeleteAudio = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const targetTitle = deleteTarget.title?.bn || 'অডিও ট্র্যাক';

    updateData(prev => ({
      ...prev,
      audio: prev.audio.filter(a => a.id !== id)
    }));

    addActivityLog('অডিও মুছে ফেলা', targetTitle, `আইডি: ${id}`);
    setDeleteTarget(null);
  };

  const filteredAudio = data.audio.filter(a => {
    const matchQuery = (a.title?.bn + a.title?.en + a.speaker?.bn).toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchQuery) return false;
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6" id="audio-manager-cms">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">অডিও তিলাওয়াত ও বয়ান ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500">
            কুরআন তিলাওয়াত, ওয়াজ মাহফিলের অডিও ও নাশিদ রেকর্ড ফাইল আপলোড করুন।
          </p>
        </div>
        <button
          onClick={() =>
            setEditingAudio({
              title: { bn: '', en: '', ar: '' },
              speaker: { bn: '', en: '', ar: '' },
              category: 'quran',
              audioUrl: 'https://server8.mp3quran.net/afs/001.mp3',
              duration: '০৫:০০',
              date: new Date().toISOString().split('T')[0],
              isPublished: true,
              playCount: 0
            })
          }
          className="px-4 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অডিও যোগ করুন</span>
        </button>
      </div>

      {/* Editor Form */}
      {editingAudio && (
        <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4 text-xs sm:text-sm animate-in fade-in duration-150">
          <div className="font-bold text-purple-950 flex items-center justify-between border-b border-purple-200 pb-2">
            <span>{editingAudio.id ? 'অডিও ট্র্যাক সম্পাদনা' : 'নতুন অডিও ট্র্যাক যোগ'}</span>
            <button
              onClick={() => setEditingAudio(null)}
              className="text-xs text-slate-500 hover:text-slate-800 hover:underline"
            >
              বাতিল
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-800">অডিওর শিরোনাম (বাংলা) *</label>
              <input
                type="text"
                placeholder="যেমন: সূরা আর-রহমান সুললিত তিলাওয়াত"
                value={editingAudio.title?.bn || ''}
                onChange={e => setEditingAudio({ ...editingAudio, title: { bn: e.target.value, en: editingAudio.title?.en || '', ar: editingAudio.title?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-purple-300 bg-white focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-800">কারী / বক্তার নাম (বাংলা) *</label>
              <input
                type="text"
                placeholder="যেমন: ক্বারী আব্দুল বাসেত বা মাওলানা..."
                value={editingAudio.speaker?.bn || ''}
                onChange={e => setEditingAudio({ ...editingAudio, speaker: { bn: e.target.value, en: editingAudio.speaker?.en || '', ar: editingAudio.speaker?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-purple-300 bg-white focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-800">ক্যাটাগরি</label>
              <select
                value={editingAudio.category || 'quran'}
                onChange={e => setEditingAudio({ ...editingAudio, category: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-purple-300 bg-white font-medium"
              >
                <option value="quran">কুরআন তিলাওয়াত (Quran Recitation)</option>
                <option value="waz">ওয়াজ ও নসীহত (Waz Mahfil)</option>
                <option value="nasheed">নাশিদ ও হামদ-নাত (Islamic Nasheed)</option>
                <option value="lectures">দারস ও লেকচার (Lectures)</option>
                <option value="programs">অনুষ্ঠান ও দোয়া (Programs)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-800">স্থায়িত্ব (Duration)</label>
              <input
                type="text"
                placeholder="যেমন: ০৭:৪৫"
                value={editingAudio.duration || ''}
                onChange={e => setEditingAudio({ ...editingAudio, duration: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-purple-300 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-800">রেকর্ডিং তারিখ</label>
              <input
                type="date"
                value={editingAudio.date || ''}
                onChange={e => setEditingAudio({ ...editingAudio, date: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-purple-300 bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <FileUpload
              id="audio-file-upload-admin"
              value={editingAudio.audioUrl || ''}
              onChange={(fileUrl, meta) => {
                setEditingAudio({
                  ...editingAudio,
                  audioUrl: fileUrl,
                  duration: meta?.duration || editingAudio.duration || '০৫:০০'
                });
              }}
              label="অডিও ফাইল আপলোড বা সরাসরি MP3 লিংক (Upload MP3 Audio File) *"
              helperText="MP3, WAV, OGG ফরম্যাটের অডিও ফাইল আপলোড করুন বা সরাসরি লিংক দিন"
              accept=".mp3,.wav,.ogg,.m4a,.aac"
              currentFileType="audio"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setEditingAudio(null)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-semibold text-xs text-slate-800 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              onClick={() => handleSaveAudio(editingAudio)}
              className="px-5 py-2 bg-purple-800 hover:bg-purple-700 rounded-xl font-bold text-xs text-white shadow-sm cursor-pointer"
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
            placeholder="অডিও বা বক্তা খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs outline-none"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'সব' },
            { id: 'quran', label: 'কুরআন' },
            { id: 'waz', label: 'ওয়াজ' },
            { id: 'nasheed', label: 'নাশিদ' },
            { id: 'lectures', label: 'লেকচার' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-purple-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audio List */}
      <div className="space-y-3">
        {filteredAudio.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            কোনো অডিও ট্র্যাক পাওয়া যায়নি।
          </div>
        ) : (
          filteredAudio.map(track => {
            const isThisPlaying = currentTrack?.id === track.id && isPlayingAudio;
            return (
              <div
                key={track.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => {
                      if (currentTrack?.id === track.id) {
                        togglePlayAudio();
                      } else {
                        playTrack(track);
                      }
                    }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 cursor-pointer shadow-xs ${
                      isThisPlaying
                        ? 'bg-purple-800 text-white animate-pulse'
                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    }`}
                    title={isThisPlaying ? 'পজ করুন' : 'প্লে করুন'}
                  >
                    {isThisPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded uppercase">
                        {track.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {track.duration}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        • প্লে: {track.playCount || 0}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1 truncate">
                      {getLocalized(track.title, language)}
                    </h4>
                    <p className="text-xs text-purple-900/70 font-medium truncate">
                      {getLocalized(track.speaker, language)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                  {track.audioUrl && (
                    <audio
                      controls
                      src={track.audioUrl}
                      className="h-8 max-w-[160px] sm:max-w-[200px]"
                    />
                  )}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingAudio(track)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 transition-colors cursor-pointer"
                      title="সম্পাদনা"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAudio(track)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 transition-colors cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="অডিও ট্র্যাক মুছে ফেলা"
        itemName={deleteTarget?.title?.bn}
        message="আপনি কি নিশ্চিতভাবে এই অডিও ট্র্যাকটি মুছে ফেলতে চান? এটি মুছে ফেললে ওয়েবসাইট থেকে অপসারিত হবে।"
        onConfirm={confirmDeleteAudio}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
