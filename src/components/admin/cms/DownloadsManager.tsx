import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Download,
  Search,
  AlertTriangle,
  ExternalLink,
  FileCode,
  FileArchive
} from 'lucide-react';
import { useMadrasa } from '../../../context/MadrasaContext';
import { DownloadItem } from '../../../types';
import { getLocalized } from '../../../lib/translations';
import { FileUpload } from '../FileUpload';
import { hasPermission } from '../../../lib/security';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

export const DownloadsManager: React.FC = () => {
  const { data, updateData, currentUser, addActivityLog, language } = useMadrasa();
  const [editingDownload, setEditingDownload] = useState<Partial<DownloadItem> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<DownloadItem | null>(null);

  const canManage = hasPermission(currentUser, 'manage_downloads');

  if (!canManage) {
    return (
      <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-950">অনুমতি নেই (Access Restricted)</h3>
        <p className="text-xs text-amber-800 mt-1">
          আপনার অ্যাকাউন্টে ডাউনলোড ও ফরম ফাইল পরিচালনার অনুমতি (manage_downloads) নেই।
        </p>
      </div>
    );
  }

  const handleSaveDownload = (item: Partial<DownloadItem>) => {
    if (!item.title?.bn || !item.fileUrl || item.fileUrl === '#') {
      alert('ডকুমেন্টের নাম এবং ফাইল আপলোড আবশ্যক।');
      return;
    }

    const newId = item.id || `doc-${Date.now()}`;
    const cleanItem: DownloadItem = {
      id: newId,
      title: {
        bn: item.title?.bn || '',
        en: item.title?.en || item.title?.bn || '',
        ar: item.title?.ar || item.title?.bn || ''
      },
      category: item.category || 'admission',
      fileUrl: item.fileUrl,
      fileSize: item.fileSize || '১.২ MB',
      fileType: item.fileType || 'pdf',
      date: item.date || new Date().toISOString().split('T')[0],
      downloadCount: item.downloadCount || 0
    };

    updateData(prev => {
      const exists = prev.downloads.some(d => d.id === cleanItem.id);
      const downloads = exists
        ? prev.downloads.map(d => d.id === cleanItem.id ? cleanItem : d)
        : [cleanItem, ...prev.downloads];
      return { ...prev, downloads };
    });

    addActivityLog(
      item.id ? 'ডকুমেন্ট সম্পাদন' : 'নতুন ফাইল আপলোড',
      cleanItem.title.bn,
      `সাইজ: ${cleanItem.fileSize}, ফরম্যাট: ${cleanItem.fileType}`
    );

    setEditingDownload(null);
  };

  const handleDeleteDownload = (item: DownloadItem) => {
    setDeleteTarget(item);
  };

  const confirmDeleteDownload = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const targetTitle = deleteTarget.title?.bn || 'ডকুমেন্ট';

    updateData(prev => ({
      ...prev,
      downloads: prev.downloads.filter(d => d.id !== id)
    }));

    addActivityLog('ডকুমেন্ট মুছে ফেলা', targetTitle, `আইডি: ${id}`);
    setDeleteTarget(null);
  };

  const filteredDownloads = data.downloads.filter(d => {
    const matchQuery = (d.title?.bn + d.title?.en).toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchQuery) return false;
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
    return true;
  });

  const getFormatBadge = (type: string) => {
    if (type === 'pdf') return <span className="bg-red-100 text-red-800 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">PDF</span>;
    if (type === 'doc') return <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">DOC</span>;
    if (type === 'zip') return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">ZIP</span>;
    return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{type}</span>;
  };

  return (
    <div className="space-y-6" id="downloads-manager-cms">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">ডাউনলোড ও ফরম ফাইল ব্যবস্থাপনা</h2>
          <p className="text-xs text-slate-500">
            ভর্তি ফরম, প্রসপেক্টাস, সিলেবাস, ফলাফল ও প্রাতিষ্ঠানিক নির্দেশিকা আপলোড ও নিয়ন্ত্রণ করুন।
          </p>
        </div>
        <button
          onClick={() =>
            setEditingDownload({
              title: { bn: '', en: '', ar: '' },
              category: 'admission',
              fileType: 'pdf',
              fileSize: '১.২ MB',
              fileUrl: '',
              date: new Date().toISOString().split('T')[0],
              downloadCount: 0
            })
          }
          className="px-4 py-2.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ডকুমেন্ট আপলোড</span>
        </button>
      </div>

      {/* Download Editor Form */}
      {editingDownload && (
        <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-4 text-xs sm:text-sm animate-in fade-in duration-150">
          <div className="font-bold text-indigo-950 flex items-center justify-between border-b border-indigo-200 pb-2">
            <span>{editingDownload.id ? 'ডকুমেন্ট তথ্য সম্পাদন' : 'নতুন ফাইল আপলোড'}</span>
            <button
              onClick={() => setEditingDownload(null)}
              className="text-xs text-slate-500 hover:text-slate-800 hover:underline"
            >
              বাতিল
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-800">ডকুমেন্ট / ফরমের নাম (বাংলা) *</label>
              <input
                type="text"
                placeholder="যেমন: নতুন শিক্ষাবর্ষের ভর্তি ফরম ও নির্দেশিকা"
                value={editingDownload.title?.bn || ''}
                onChange={e => setEditingDownload({ ...editingDownload, title: { bn: e.target.value, en: editingDownload.title?.en || '', ar: editingDownload.title?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-800">ডকুমেন্টের নাম (English)</label>
              <input
                type="text"
                placeholder="e.g. Admission Application Form"
                value={editingDownload.title?.en || ''}
                onChange={e => setEditingDownload({ ...editingDownload, title: { bn: editingDownload.title?.bn || '', en: e.target.value, ar: editingDownload.title?.ar || '' } })}
                className="w-full p-2.5 rounded-xl border border-indigo-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-800">ক্যাটাগরি</label>
              <select
                value={editingDownload.category || 'admission'}
                onChange={e => setEditingDownload({ ...editingDownload, category: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-indigo-300 bg-white font-medium"
              >
                <option value="admission">ভর্তি ফরম (Admission)</option>
                <option value="academic">একাডেমিক ক্যালেন্ডার ও সিলেবাস</option>
                <option value="prospectus">প্রসপেক্টাস ও পরিচিতি</option>
                <option value="rules">আইন ও নীতিমালা</option>
                <option value="forms">অন্যান্য দরখাস্ত ফরম</option>
                <option value="results">পরীক্ষার ফলাফল</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-800">ফাইল ফরম্যাট</label>
              <select
                value={editingDownload.fileType || 'pdf'}
                onChange={e => setEditingDownload({ ...editingDownload, fileType: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-indigo-300 bg-white font-medium"
              >
                <option value="pdf">PDF Document (.pdf)</option>
                <option value="doc">Word / Text Document (.doc/.docx)</option>
                <option value="zip">ZIP / Archive (.zip/.rar)</option>
                <option value="image">Image / Graphic (.jpg/.png)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-800">ফাইল সাইজ (যেমন: ১.২ MB)</label>
              <input
                type="text"
                placeholder="যেমন: ১.৫ MB"
                value={editingDownload.fileSize || ''}
                onChange={e => setEditingDownload({ ...editingDownload, fileSize: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-indigo-300 bg-white"
              />
            </div>
          </div>

          <div>
            <FileUpload
              id="download-item-file-upload-field"
              value={editingDownload.fileUrl || ''}
              currentFileSize={editingDownload.fileSize}
              currentFileType={editingDownload.fileType}
              onChange={(fileUrl, meta) => {
                setEditingDownload({
                  ...editingDownload,
                  fileUrl,
                  fileSize: meta?.fileSize || editingDownload.fileSize || '১.২ MB',
                  fileType: meta?.fileType || editingDownload.fileType || 'pdf'
                });
              }}
              label="ফাইল আপলোড বা অনলাইন লিংক (Upload File / Cloud Link) *"
              helperText="সরাসরি PDF, DOC বা ZIP ফাইল আপলোড করুন অথবা গুগল ড্রাইভ ফাইল লিংক দিন"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setEditingDownload(null)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-semibold text-xs text-slate-800 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              onClick={() => handleSaveDownload(editingDownload)}
              className="px-5 py-2 bg-indigo-800 hover:bg-indigo-700 rounded-xl font-bold text-xs text-white shadow-sm cursor-pointer"
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
            placeholder="ফরম বা ডকুমেন্টের নাম খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs outline-none"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'সব' },
            { id: 'admission', label: 'ভর্তি ফরম' },
            { id: 'academic', label: 'সিলেবাস' },
            { id: 'prospectus', label: 'প্রসপেক্টাস' },
            { id: 'results', label: 'ফলাফল' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-indigo-800 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Downloads List */}
      <div className="space-y-3">
        {filteredDownloads.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            কোনো ডাউনলোড ফাইল পাওয়া যায়নি।
          </div>
        ) : (
          filteredDownloads.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getFormatBadge(item.fileType)}
                    <span className="text-xs text-slate-500 font-mono">
                      {item.fileSize}
                    </span>
                    <span className="text-xs text-slate-400">
                      • ডাউনলোড: {item.downloadCount || 0} বার
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1 truncate">
                    {getLocalized(item.title, language)}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    আপলোড: {item.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                {item.fileUrl && item.fileUrl !== '#' && (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="ডাউনলোড পরীক্ষা"
                  >
                    <Download className="w-4 h-4" />
                    <span>ডাউনলোড</span>
                  </a>
                )}
                <button
                  onClick={() => setEditingDownload(item)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 transition-colors cursor-pointer"
                  title="সম্পাদনা"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteDownload(item)}
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
        title="ডকুমেন্ট মুছে ফেলা"
        itemName={deleteTarget?.title?.bn}
        message="আপনি কি নিশ্চিতভাবে এই ডকুমেন্টটি মুছে ফেলতে চান? এটি মুছে ফেললে ডাউনলোড সেন্টার থেকে অপসারিত হবে।"
        onConfirm={confirmDeleteDownload}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
