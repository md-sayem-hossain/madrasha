import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  Music,
  File,
  X,
  Link,
  Check,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { formatBytes, sanitizeUrl } from '../../lib/security';

interface FileUploadProps {
  id?: string;
  value: string; // URL or Data URL
  onChange: (fileUrl: string, metadata?: { fileSize?: string; fileType?: 'pdf' | 'doc' | 'image' | 'zip'; originalName?: string; duration?: string }) => void;
  label?: string;
  helperText?: string;
  accept?: string;
  maxSizeMB?: number;
  currentFileSize?: string;
  currentFileType?: string;
  allowUrlToggle?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  value,
  onChange,
  label = 'ফাইল আপলোড করুন (Upload Document/File)',
  helperText = 'PDF, DOC, DOCX, ZIP বা MP3 ফরম্যাট (সর্বোচ্চ ১৫ MB)',
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.mp3,.wav,.ogg,.m4a',
  maxSizeMB = 15,
  currentFileSize,
  currentFileType,
  allowUrlToggle = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const detectFileType = (mimeType: string, filename: string): 'pdf' | 'doc' | 'image' | 'zip' => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf' || mimeType.includes('pdf')) return 'pdf';
    if (['doc', 'docx', 'odt', 'rtf', 'txt'].includes(ext) || mimeType.includes('word') || mimeType.includes('officedocument')) return 'doc';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || mimeType.includes('zip') || mimeType.includes('compressed')) return 'zip';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext) || mimeType.startsWith('image/')) return 'image';
    return 'pdf';
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`ফাইল সাইজ ${maxSizeMB} মেগাবাইটের কম হতে হবে (বর্তমান সাইজ: ${formatBytes(file.size, 'bn')})`);
      return;
    }

    setIsProcessing(true);
    const calculatedSize = formatBytes(file.size, 'bn');
    const detectedType = detectFileType(file.type, file.name);

    // If it's audio, also try to measure duration
    if (file.type.startsWith('audio/') || file.name.endsWith('.mp3')) {
      const audioUrl = URL.createObjectURL(file);
      const tempAudio = new Audio(audioUrl);
      tempAudio.onloadedmetadata = () => {
        const totalSecs = Math.floor(tempAudio.duration);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        const toBengaliNumber = (num: number) => {
          const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
          return String(num).padStart(2, '0').replace(/[0-9]/g, d => bnDigits[Number(d)] || d);
        };
        const durationFormatted = `${toBengaliNumber(mins)}:${toBengaliNumber(secs)}`;

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onChange(result, {
            fileSize: calculatedSize,
            fileType: detectedType,
            originalName: file.name,
            duration: durationFormatted
          });
          setIsProcessing(false);
        };
        reader.readAsDataURL(file);
      };
      tempAudio.onerror = () => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onChange(result, {
            fileSize: calculatedSize,
            fileType: detectedType,
            originalName: file.name
          });
          setIsProcessing(false);
        };
        reader.readAsDataURL(file);
      };
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result, {
        fileSize: calculatedSize,
        fileType: detectedType,
        originalName: file.name
      });
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setErrorMsg('ফাইলটি পড়তে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
      setIsProcessing(false);
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

  const renderFileIcon = () => {
    const type = currentFileType?.toLowerCase() || '';
    if (type === 'pdf') return <FileText className="w-6 h-6 text-red-600" />;
    if (type === 'doc') return <FileCode className="w-6 h-6 text-blue-600" />;
    if (type === 'zip') return <FileArchive className="w-6 h-6 text-amber-600" />;
    if (type.includes('audio') || accept.includes('mp3')) return <Music className="w-6 h-6 text-purple-600" />;
    return <File className="w-6 h-6 text-emerald-600" />;
  };

  return (
    <div className="space-y-1.5" id={id || 'file-upload-component'}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
        {allowUrlToggle && (
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-indigo-700 hover:text-indigo-800 flex items-center gap-1 font-medium"
          >
            <Link className="w-3 h-3" />
            <span>{showUrlInput ? 'ফাইল আপলোড মোড' : 'বা অনলাইন ফাইল লিংক'}</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {showUrlInput ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(sanitizeUrl(e.target.value))}
              placeholder="https://drive.google.com/... বা https://yoursite.com/file.pdf"
              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
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
          <p className="text-[10px] text-slate-400">
            গুগল ড্রাইভ, ড্রপবক্স বা সার্ভারের সরাসরি ফাইল শেয়ার লিংক পেস্ট করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          {value && value !== '#' ? (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center flex-shrink-0">
                  {renderFileIcon()}
                </div>
                <div className="min-w-0 truncate">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ফাইল সংযুক্ত রয়েছে</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                    {currentFileSize && (
                      <span className="font-mono bg-slate-200/70 px-1.5 py-0.2 rounded text-slate-700">
                        {currentFileSize}
                      </span>
                    )}
                    {currentFileType && (
                      <span className="uppercase font-bold text-slate-600">
                        {currentFileType}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 font-semibold flex items-center gap-1"
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
                  ? 'border-indigo-600 bg-indigo-50 scale-[1.01]'
                  : 'border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/30'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                {isProcessing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {isProcessing ? 'ফাইল প্রসেসিং হচ্ছে...' : 'ফাইল নির্বাচন করতে এখানে ক্লিক করুন'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  বা ফাইল টেনে এনে এখানে ড্রপ করুন (Drag & Drop)
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
