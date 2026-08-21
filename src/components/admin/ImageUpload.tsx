import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Link, RefreshCw, Check, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  id?: string;
  value: string;
  onChange: (dataUrlOrUrl: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'any';
  previewHeight?: string;
  folder?: 'teachers' | 'founders' | 'gallery' | 'general';
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  id,
  value,
  onChange,
  label = 'ছবি আপলোড করুন (Upload Image)',
  helperText = 'JPG, PNG, WEBP ফরম্যাট (প্রজেক্ট ফোল্ডারে সংরক্ষিত হবে)',
  aspectRatio = 'any',
  previewHeight = 'h-36',
  folder = 'general'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const uploadToServer = async (base64Data: string, originalName?: string) => {
    setIsProcessing(true);
    setStatusMessage('প্রজেক্ট ফোল্ডারে সেভ হচ্ছে...');
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Data,
          folder: folder,
          filename: originalName || `${folder}-photo`
        })
      });
      const data = await response.json();
      if (data.success && data.url) {
        onChange(data.url);
        setStatusMessage('প্রজেক্ট ফোল্ডারে সফলভাবে সেভ হয়েছে!');
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        // Fallback to base64 if server returned error
        onChange(base64Data);
        setStatusMessage('লোকাল ডাটা হিসেবে সংরক্ষিত');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.warn('Direct upload error, applying fallback:', err);
      onChange(base64Data);
      setStatusMessage('লোকাল ডাটা হিসেবে সংরক্ষিত');
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('ছবির সাইজ ১৫ মেগাবাইটের কম হতে হবে।');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('ছবি প্রসেসিং হচ্ছে...');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      // Optimize image size using canvas if very large
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
            const compressed = canvas.toDataURL('image/jpeg', 0.88);
            uploadToServer(compressed, file.name);
            return;
          }
        }
        uploadToServer(result, file.name);
      };
      img.onerror = () => {
        uploadToServer(result, file.name);
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

  const isLocalProjectFile = value && value.startsWith('/uploads/');

  return (
    <div className="space-y-1.5" id={id || 'image-upload-field'}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium cursor-pointer"
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
              placeholder="https://images.unsplash.com/... বা /uploads/..."
              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 cursor-pointer"
                title="মুছে ফেলুন"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {value && (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="relative w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400';
                  }}
                />
              </div>
              <div className="text-[11px] text-slate-600 min-w-0 flex-1">
                <p className="font-semibold text-slate-800 truncate">{value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">বাহ্যিক বা লোকাল লিংক সক্রিয় রয়েছে</p>
              </div>
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
                <div className={`relative ${previewHeight} w-28 rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-slate-900 flex-shrink-0 shadow-xs`}>
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

                  {isLocalProjectFile ? (
                    <div className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                      <HardDrive className="w-2.5 h-2.5" />
                      <span className="truncate">প্রজেক্ট ফোল্ডার: {value}</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      সফলভাবে যুক্ত হয়েছে
                    </p>
                  )}

                  {statusMessage && (
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{statusMessage}</span>
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                      <span>{isProcessing ? 'আপলোড হচ্ছে...' : 'পরিবর্তন করুন'}</span>
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => onChange('')}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-semibold flex items-center gap-1 cursor-pointer"
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
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-emerald-600 bg-emerald-50 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                {isProcessing ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-emerald-700" />
                ) : (
                  <Upload className="w-5 h-5 text-emerald-700" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {isProcessing ? (statusMessage || 'প্রজেক্ট ফোল্ডারে সেভ হচ্ছে...') : 'ছবি আপলোড করতে এখানে ক্লিক করুন'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  বা ফাইল টেনে এনে এখানে ছেড়ে দিন (Drag & Drop)
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <HardDrive className="w-3 h-3 text-emerald-600" />
                <span>{helperText}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
