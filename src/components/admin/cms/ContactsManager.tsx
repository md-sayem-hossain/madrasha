import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  Trash2,
  Search,
  AlertTriangle,
  MessageSquare,
  Eye,
  Check
} from 'lucide-react';
import { useMadrasa } from '../../../context/MadrasaContext';
import { ContactMessage } from '../../../types';
import { hasPermission } from '../../../lib/security';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

export const ContactsManager: React.FC = () => {
  const { data, updateData, currentUser, addActivityLog } = useMadrasa();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'replied'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const canManage = hasPermission(currentUser, 'manage_contacts');

  if (!canManage) {
    return (
      <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-950">অনুমতি নেই (Access Restricted)</h3>
        <p className="text-xs text-amber-800 mt-1">
          আপনার অ্যাকাউন্টে যোগাযোগের বার্তা ইনবক্স দেখার অনুমতি (manage_contacts) নেই।
        </p>
      </div>
    );
  }

  const contactsList = data.contacts || [];

  const handleMarkAsRead = (id: string) => {
    updateData(prev => ({
      ...prev,
      contacts: (prev.contacts || []).map(c => c.id === id ? { ...c, isRead: true } : c)
    }));
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'replied' ? 'pending' : 'replied';
    updateData(prev => ({
      ...prev,
      contacts: (prev.contacts || []).map(c => c.id === id ? { ...c, replyStatus: nextStatus as any, isRead: true } : c)
    }));
    addActivityLog('বার্তা স্ট্যাটাস পরিবর্তন', 'ইনবক্স', `স্ট্যাটাস: ${nextStatus}`);
  };

  const handleDeleteMessage = (message: ContactMessage) => {
    setDeleteTarget(message);
  };

  const confirmDeleteMessage = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const senderName = deleteTarget.name;

    updateData(prev => ({
      ...prev,
      contacts: (prev.contacts || []).filter(c => c.id !== id)
    }));

    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }

    addActivityLog('বার্তা মুছে ফেলা', senderName, `আইডি: ${id}`);
    setDeleteTarget(null);
  };

  const filteredContacts = contactsList.filter(c => {
    const match = (c.name + c.phone + c.subject + c.message).toLowerCase().includes(searchQuery.toLowerCase());
    if (!match) return false;
    if (statusFilter === 'pending') return c.replyStatus === 'pending';
    if (statusFilter === 'replied') return c.replyStatus === 'replied';
    return true;
  });

  return (
    <div className="space-y-6" id="contacts-manager-cms">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">অনুসন্ধান ও বার্তা ইনবক্স</h2>
          <p className="text-xs text-slate-500">
            ওয়েবসাইট থেকে সাধারণ মানুষ ও অভিভাবকদের পাঠানো অনুসন্ধান বার্তা ও যোগাযোগের তালিকা।
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          মোট বার্তা: {contactsList.length} টি
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="নাম, ফোন বা বিষয় খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs outline-none"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${statusFilter === 'all' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
          >
            সব ({contactsList.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${statusFilter === 'pending' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
          >
            অমীমাংসিত ({contactsList.filter(c => c.replyStatus === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('replied')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${statusFilter === 'replied' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
          >
            উত্তর দেওয়া হয়েছে ({contactsList.filter(c => c.replyStatus === 'replied').length})
          </button>
        </div>
      </div>

      {/* Selected Message View Modal */}
      {selectedMessage && (
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
            <h4 className="font-bold text-slate-900 text-sm">{selectedMessage.subject}</h4>
            <button
              onClick={() => setSelectedMessage(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              বন্ধ করুন
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
            <div>
              <strong>প্রেরক:</strong> {selectedMessage.name}
            </div>
            <div>
              <strong>মোবাইল:</strong> <a href={`tel:${selectedMessage.phone}`} className="text-emerald-800 font-mono hover:underline">{selectedMessage.phone}</a>
            </div>
            <div>
              <strong>তারিখ:</strong> <span className="font-mono">{selectedMessage.date}</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-emerald-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
            {selectedMessage.message}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => handleToggleStatus(selectedMessage.id, selectedMessage.replyStatus || 'pending')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                selectedMessage.replyStatus === 'replied'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-emerald-800 text-white hover:bg-emerald-700'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{selectedMessage.replyStatus === 'replied' ? 'অমীমাংসিত হিসেবে চিহ্নিত করুন' : 'উত্তর সম্পন্ন হিসেবে চিহ্নিত করুন'}</span>
            </button>

            <button
              onClick={() => handleDeleteMessage(selectedMessage.id)}
              className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 cursor-pointer"
              title="মুছে ফেলুন"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className="space-y-2.5">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            কোনো বার্তা পাওয়া যায়নি।
          </div>
        ) : (
          filteredContacts.map(c => (
            <div
              key={c.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                !c.isRead
                  ? 'border-emerald-400 bg-emerald-50/30 font-semibold'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    c.replyStatus === 'replied'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.replyStatus === 'replied' ? 'উত্তর সম্পন্ন' : 'অমীমাংসিত'}
                  </span>
                  <span className="font-bold text-slate-900">{c.name}</span>
                  <span className="text-slate-500 font-mono">({c.phone})</span>
                  <span className="text-slate-400 font-mono">• {c.date}</span>
                </div>
                <h4 className="text-slate-900 text-xs mt-1 truncate">
                  {c.subject}
                </h4>
                <p className="text-slate-500 text-[11px] line-clamp-1 font-normal">
                  {c.message}
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                <button
                  onClick={() => {
                    handleMarkAsRead(c.id);
                    setSelectedMessage(c);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>দেখুন</span>
                </button>
                <button
                  onClick={() => handleDeleteMessage(c)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="বার্তা মুছে ফেলা"
        itemName={deleteTarget ? `${deleteTarget.name} - ${deleteTarget.subject}` : undefined}
        message="আপনি কি নিশ্চিতভাবে এই অনুসন্ধান বার্তাটি মুছে ফেলতে চান? এটি ইনবক্স থেকে অপসারিত হবে।"
        onConfirm={confirmDeleteMessage}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
