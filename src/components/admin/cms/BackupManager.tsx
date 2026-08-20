import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  FileJson,
  ShieldAlert,
  Database,
  Lock
} from 'lucide-react';
import { useMadrasa } from '../../../context/MadrasaContext';
import { validateDatabaseSchema, formatBytes } from '../../../lib/security';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

export const BackupManager: React.FC = () => {
  const { data, updateData, currentUser, addActivityLog, resetToInitialSeed, saveDataToServer } = useMadrasa();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingRestoreData, setPendingRestoreData] = useState<{ data: any; fileName: string } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const isSuperAdmin = currentUser?.role === 'super_admin';

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleExportBackup = () => {
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `al_jadid_madrasa_backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addActivityLog('ব্যাকআপ ডাউনলোড', 'সিস্টেম ব্যাকআপ', `JSON ডেটাবেজ এক্সপোর্ট সম্পন্ন (${formatBytes(blob.size, 'bn')})`);
      showToast('success', 'সম্পূর্ণ ডেটাবেজ ব্যাকআপ ফাইল ডাউনলোড সম্পন্ন হয়েছে!');
    } catch (err: any) {
      showToast('error', 'ব্যাকআপ ডাউনলোড ব্যর্থ হয়েছে: ' + err.message);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw);

        // Validate schema integrity
        const validation = validateDatabaseSchema(parsed);
        if (!validation.valid || !validation.validatedData) {
          showToast('error', validation.error || 'ব্যাকআপ ফাইলের কাঠামো সঠিক নয়।');
          setIsProcessing(false);
          return;
        }

        setPendingRestoreData({
          data: validation.validatedData,
          fileName: file.name
        });
      } catch (err: any) {
        showToast('error', 'ফাইল প্রসেসিং ব্যর্থ: ' + err.message);
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const confirmRestoreBackup = async () => {
    if (!pendingRestoreData) return;
    try {
      updateData(pendingRestoreData.data);
      await saveDataToServer();
      addActivityLog('ব্যাকআপ রিস্টোর', 'সিস্টেম ব্যাকআপ', `ফাইল: ${pendingRestoreData.fileName}`);
      showToast('success', 'ডেটাবেজ ব্যাকআপ সফলভাবে রিস্টোর করা হয়েছে!');
    } catch (err: any) {
      showToast('error', 'রিস্টোর ব্যর্থ: ' + err.message);
    } finally {
      setPendingRestoreData(null);
    }
  };

  const confirmResetSeed = () => {
    resetToInitialSeed();
    showToast('success', 'সিস্টেম প্রাথমিক অবস্থায় রিসেট করা হয়েছে।');
    setIsResetConfirmOpen(false);
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200">
        <Lock className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-950">শুধুমাত্র সুপার অ্যাডমিন অনুমতি (Super Admin Only)</h3>
        <p className="text-xs text-amber-800 mt-1">
          সম্পূর্ণ ডেটাবেজ ব্যাকআপ ও রিস্টোর করার权限 শুধুমাত্র সুপার অ্যাডমিনের অ্যাকাউন্টে সংরক্ষিত।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="backup-manager-cms">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">ডেটাবেজ ব্যাকআপ ও নিরাপত্তা রিস্টোর</h2>
        <p className="text-xs text-slate-500">
          মাদ্রাসার সমস্ত তথ্য সুরক্ষিত রাখতে ব্যাকআপ JSON ফাইল ডাউনলোড বা পূর্বের ব্যাকআপ রিস্টোর করুন।
        </p>
      </div>

      {toastMsg && (
        <div
          className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            toastMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toastMsg.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">সম্পূর্ণ ডেটাবেজ এক্সপোর্ট (Download Backup)</h3>
            <p className="text-xs text-slate-500 mt-1">
              শিক্ষক, নোটিশ, ইভেন্ট, অডিও, ভিডিও, গ্যালারি ও সেটিংস সহ সমস্ত তথ্য একটি নিরাপদ `.json` ফাইলে ডাউনলোড করুন।
            </p>
          </div>
          <button
            onClick={handleExportBackup}
            className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>এখনই ব্যাকআপ ফাইল ডাউনলোড করুন</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">ব্যাকআপ ফাইল থেকে রিস্টোর (Restore Backup)</h3>
            <p className="text-xs text-slate-500 mt-1">
              পূর্বে ডাউনলোড করা `.json` ফাইল সিলেক্ট করে সমস্ত তথ্য পুনরুদ্ধার ও রিস্টোর করুন। (ইনটিগ্রিটি ভ্যালিডেশন সহ)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{isProcessing ? 'প্রসেসিং হচ্ছে...' : 'ব্যাকআপ JSON ফাইল আপলোড করুন'}</span>
          </button>
        </div>
      </div>

      {/* Reset to Seed Warning */}
      <div className="p-6 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-950 text-sm">প্রাথমিক সিড ডেটায় রিসেট করুন (Reset to Initial Seed)</h4>
            <p className="text-xs text-red-800 mt-0.5">
              সিস্টেমের সমস্ত তথ্য প্রাথমিক ডেমো ডেটায় রূপান্তর করতে চান? পূর্ববর্তী কাস্টম পরিবর্তন মুছে যাবে।
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex-shrink-0 cursor-pointer"
        >
          সিস্টেম রিসেট
        </button>
      </div>

      {/* Restore Backup Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!pendingRestoreData}
        title="ব্যাকআপ ডেটা রিস্টোর নিশ্চিতকরণ"
        itemName={pendingRestoreData ? `ফাইল: ${pendingRestoreData.fileName}` : undefined}
        message="সতর্কতা: ব্যাকআপ ফাইলটি রিস্টোর করলে বর্তমান ডেটাবেজের সমস্ত তথ্য এই ব্যাকআপ ফাইলের ডেটা দ্বারা প্রতিস্থাপিত হবে। আপনি কি নিশ্চিত?"
        confirmText="হ্যাঁ, রিস্টোর করুন"
        onConfirm={confirmRestoreBackup}
        onCancel={() => setPendingRestoreData(null)}
      />

      {/* Reset to Seed Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isResetConfirmOpen}
        title="সিস্টেম রিসেট নিশ্চিতকরণ"
        itemName="সকল কাস্টম ডাটা ও সেটিংস"
        message="আপনি কি নিশ্চিতভাবে সিস্টেম রিসেট করতে চান? সমস্ত বর্তমান কাস্টম ডেটা মুছে প্রাথমিক ডেমো অবস্থায় ফিরে যাবে।"
        confirmText="হ্যাঁ, রিসেট করুন"
        onConfirm={confirmResetSeed}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
