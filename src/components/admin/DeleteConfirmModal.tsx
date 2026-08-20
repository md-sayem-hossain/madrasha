import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title = 'মুছে ফেলার নিশ্চিতকরণ',
  itemName,
  message,
  confirmText = 'হ্যাঁ, মুছে ফেলুন',
  cancelText = 'বাতিল',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="delete-confirm-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        id="delete-confirm-modal-box"
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          {itemName && (
            <div className="mt-2 p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs font-semibold text-red-950 truncate">
              "{itemName}"
            </div>
          )}
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {message || 'আপনি কি নিশ্চিতভাবে এই আইটেমটি মুছে ফেলতে চান? মুছে ফেলার পর এটি স্থায়ীভাবে ডেটাবেজ থেকে বিলুপ্ত হবে।'}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
