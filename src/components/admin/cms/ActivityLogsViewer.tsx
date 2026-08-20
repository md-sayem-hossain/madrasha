import React, { useState } from 'react';
import {
  Shield,
  Clock,
  User,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { useMadrasa } from '../../../context/MadrasaContext';
import { ActivityLog } from '../../../types';
import { hasPermission } from '../../../lib/security';

export const ActivityLogsViewer: React.FC = () => {
  const { data, updateData, currentUser, addActivityLog } = useMadrasa();
  const [searchQuery, setSearchQuery] = useState('');

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canManage = isSuperAdmin || hasPermission(currentUser, 'manage_settings');

  if (!canManage) {
    return (
      <div className="p-8 text-center rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-950">অনুমতি নেই (Access Restricted)</h3>
        <p className="text-xs text-amber-800 mt-1">
          আপনার অ্যাকাউন্টে সিকিউরিটি অ্যাক্টিভিটি অডিট লগ দেখার অনুমতি নেই।
        </p>
      </div>
    );
  }

  const logs = data.activityLogs || [];

  const handleClearLogs = () => {
    if (!window.confirm('আপনি কি নিশ্চিতভাবে সমস্ত অ্যাক্টিভিটি লগ মুছে ফেলতে চান?')) return;
    updateData(prev => ({
      ...prev,
      activityLogs: []
    }));
    addActivityLog('অডিট লগ পরিষ্কার', currentUser?.name || 'Super Admin', 'সমস্ত অ্যাক্টিভিটি লগ ক্লিয়ার করা হয়েছে।');
  };

  const filteredLogs = logs.filter(l =>
    (l.action + l.target + (l.details || '') + (l.userName || '')).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="activity-logs-viewer">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">সিকিউরিটি ও অ্যাক্টিভিটি অডিট লগ</h2>
          <p className="text-xs text-slate-500">
            অ্যাডমিন ও ইউজারদের প্রতিটি পরিবর্তন, প্রকাশ, সম্পাদন ও লগইনের স্বয়ংক্রিয় অডিট হিস্ট্রি।
          </p>
        </div>
        {isSuperAdmin && logs.length > 0 && (
          <button
            onClick={handleClearLogs}
            className="px-3.5 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>লগ মুছুন</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="অ্যাকশন, ইউজার বা টার্গেট খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs outline-none"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          মোট রেকর্ড: {logs.length} টি
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="space-y-2">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            কোনো অ্যাক্টিভিটি লগ পাওয়া যায়নি।
          </div>
        ) : (
          filteredLogs.map(log => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-all"
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0 font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-emerald-900 font-semibold">
                      {log.target}
                    </span>
                    {log.userName && (
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        • <User className="w-3 h-3 text-slate-400" /> {log.userName}
                      </span>
                    )}
                  </div>
                  {log.details && (
                    <p className="text-slate-600 text-[11px] mt-0.5 truncate">
                      {log.details}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 flex-shrink-0 self-end sm:self-auto">
                <Clock className="w-3 h-3" />
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
