import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Link, RefreshCw, Check } from 'lucide-react';

interface ImageUploadProps {
  id?: string;
  value: string;
  onChange: (dataUrlOrUrl: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'any';
  previewHeight?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  id,
  value,
  onChange,
  label = 'ছবি আপলোড করুন (Upload Image)',
  helperText = 'JPG, PNG, WEBP ফরম্যাট (সর্বোচ্চ ৫ MB)',
  aspectRatio = 'any',
  previewHeight = 'h-36'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('ছবির সাইজ ৮ মেগাবাইটের কম হতে হবে।');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Optimize image size using canvas if large
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            onChange(compressed);
            setIsProcessing(false);
            return;
          }
        }
        onChange(result);
        setIsProcessing(false);
      };
      img.onerror = () => {
        onChange(result);
        setIsProcessing(false);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-1.5" id={id || 'image-upload-field'}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium"
        >
          <Link className="w-3 h-3" />
          <span>{showUrlInput ? 'ফাইল আপলোড মোড' : 'বা ইমেজ URL লিংক'}</span>
        </button>
      </div>

      {showUrlInput ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700"
                title="মুছে ফেলুন"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {value && (
            <div className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400';
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {value ? (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`relative ${previewHeight} w-28 rounded-xl overflow-hidden border-2 border-emerald-500/30 bg-slate-900 flex-shrink-0 shadow-xs`}>
                  <img
                    src={value}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400';
                    }}
                  />
                  <div className="absolute top-1 right-1 bg-emerald-700 text-white rounded-full p-0.5 shadow">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                    <span>ছবি নির্বাচিত রয়েছে</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ডিভাইস থেকে সরাসরি সফলভাবে যুক্ত হয়েছে
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>পরিবর্তন করুন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange('')}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-semibold flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>মুছে ফেলুন</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-emerald-600 bg-emerald-50 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                {isProcessing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {isProcessing ? 'ছবি প্রসেসিং হচ্ছে...' : 'ছবি আপলোড করতে এখানে ক্লিক করুন'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  বা ফাইল টেনে এনে এখানে ছেড়ে দিন (Drag & Drop)
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {helperText}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
