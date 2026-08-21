import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  UserCheck,
  User,
  Users,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Key,
  Check,
  CheckSquare,
  Square,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Bell,
  Calendar,
  Music,
  Video,
  Image,
  FileText,
  Settings,
  Home,
  UserPlus
} from 'lucide-react';
import { useMadrasa } from '../../context/MadrasaContext';
import { UserAccount, AdminPermission, UserRole } from '../../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface PermissionOption {
  key: AdminPermission;
  label: string;
  category: string;
  icon: any;
}

const ALL_PERMISSIONS: PermissionOption[] = [
  { key: 'manage_teachers', label: 'শিক্ষকমণ্ডলী তালিকা পরিচালনা', category: 'একাডেমিক', icon: User },
  { key: 'manage_founders', label: 'প্রতিষ্ঠাতা পরিচিতি ও বার্তা', category: 'প্রশাসন', icon: Users },
  { key: 'manage_history', label: 'ইতিহাস ও ঐতিহাসিক মাইলফলক', category: 'তথ্য', icon: BookOpen },
  { key: 'manage_notices', label: 'নোটিশ বোর্ড ও জরুরি বিজ্ঞপ্তি', category: 'যোগাযোগ', icon: Bell },
  { key: 'manage_events', label: 'ইভেন্ট ও বার্ষিক মাহফিল', category: 'কার্যক্রম', icon: Calendar },
  { key: 'manage_audio', label: 'অডিও তিলাওয়াত ও অডিও লেকচার', category: 'মিডিয়া', icon: Music },
  { key: 'manage_video', label: 'ভিডিও গ্যালারি ও বয়ান', category: 'মিডিয়া', icon: Video },
  { key: 'manage_gallery', label: 'ফটো গ্যালারি অ্যালবাম', category: 'মিডিয়া', icon: Image },
  { key: 'manage_downloads', label: 'ডাউনলোড ফরম ও কিতাবসমূহ', category: 'রিসোর্স', icon: FileText },
  { key: 'manage_settings', label: 'প্রাতিষ্ঠানিক সেটিংস ও নাম', category: 'সিস্টেম', icon: Settings },
  { key: 'manage_homepage', label: 'হোমপেজ ব্যানার ও পরিসংখ্যান', category: 'সিস্টেম', icon: Home }
];

export const UserPermissionsManager: React.FC = () => {
  const {
    currentUser,
    data,
    updateUserPermissions,
    updateUserAccount,
    addUserAccount,
    deleteUserAccount,
    login,
    addActivityLog
  } = useMadrasa();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('admin');
  const [newUserPermissions, setNewUserPermissions] = useState<AdminPermission[]>([
    'manage_notices',
    'manage_events',
    'manage_gallery'
  ]);
  const [newUserLinkedFounderId, setNewUserLinkedFounderId] = useState<string>(
    data.founders[0]?.id || 'founder-1'
  );
  const [deleteTarget, setDeleteTarget] = useState<UserAccount | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleTogglePermission = (userId: string, perm: AdminPermission) => {
    const targetUser = data.users.find(u => u.id === userId);
    if (!targetUser) return;

    const currentPerms = targetUser.permissions || [];
    const hasPerm = currentPerms.includes(perm);

    const updated = hasPerm
      ? currentPerms.filter(p => p !== perm)
      : [...currentPerms, perm];

    updateUserPermissions(userId, updated);
    showToast(`অনুমতি আপডেট করা হয়েছে (${targetUser.name})`);
  };

  const handleSelectAllPermissions = (userId: string) => {
    const allKeys = ALL_PERMISSIONS.map(p => p.key);
    updateUserPermissions(userId, allKeys);
    showToast('সকল পারমিশন প্রদান করা হয়েছে');
  };

  const handleDeselectAllPermissions = (userId: string) => {
    updateUserPermissions(userId, []);
    showToast('সকল পারমিশন প্রত্যাহার করা হয়েছে');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert('অনুগ্রহ করে নাম এবং ইমেইল প্রদান করুন।');
      return;
    }

    addUserAccount({
      name: newUserName.trim(),
      username: newUserUsername.trim() || newUserEmail.split('@')[0],
      email: newUserEmail.trim(),
      password: newUserPassword.trim() || 'madrasa123',
      role: newUserRole,
      permissions: newUserRole === 'admin' ? newUserPermissions : [],
      linkedFounderId: newUserRole === 'founder' ? newUserLinkedFounderId : undefined,
      isActive: true
    });

    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserUsername('');
    setNewUserPassword('');
    showToast('নতুন ইউজার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
  };

  const handleDeleteUser = (user: UserAccount) => {
    if (user.id === currentUser?.id) {
      showToast('আপনি আপনার বর্তমান সক্রিয় সুপার অ্যাডমিন অ্যাকাউন্ট মুছতে পারবেন না।');
      return;
    }
    setDeleteTarget(user);
  };

  const confirmDeleteUser = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    const name = deleteTarget.name;
    deleteUserAccount(id);
    showToast(`"${name}" ইউজার অ্যাকাউন্ট মুছে ফেলা হয়েছে।`);
    setDeleteTarget(null);
  };

  const handleSwitchUser = (user: UserAccount) => {
    login(user.role, user.email);
    showToast(`সফলভাবে "${user.name}" (${user.role}) অ্যাকাউন্টে সুইচ করা হয়েছে।`);
  };

  return (
    <div id="user-permissions-manager" className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-600 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Notice Banner */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-800" />
            <span>ইউজার ও পারমিশন কন্ট্রোল (Role-Based Access Control)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            সুপার অ্যাডমিন হিসেবে আপনি সাধারণ অ্যাডমিনদের নির্দিষ্ট মডিউল অ্যাক্সেস প্রদান করতে পারেন এবং প্রতিষ্ঠাতা সদস্যদের নিয়ন্ত্রণ করতে পারেন।
          </p>
        </div>

        <button
          id="open-add-user-modal-btn"
          onClick={() => setIsAddUserModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
        >
          <UserPlus className="w-4 h-4 text-amber-300" />
          <span>নতুন ইউজার অ্যাকাউন্ট তৈরি করুন</span>
        </button>
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-emerald-900 uppercase">সুপার অ্যাডমিন</div>
            <div className="text-xl font-extrabold text-emerald-950">
              {data.users.filter(u => u.role === 'super_admin').length} জন
            </div>
            <div className="text-[10px] text-emerald-700">সম্পূর্ণ প্রশাসনিক অধিকারপ্রাপ্ত</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-blue-900 uppercase">সাধারণ অ্যাডমিন</div>
            <div className="text-xl font-extrabold text-blue-950">
              {data.users.filter(u => u.role === 'admin').length} জন
            </div>
            <div className="text-[10px] text-blue-700">অনুমোদিত সেকশন নিয়ন্ত্রক</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-900 uppercase">প্রতিষ্ঠাতা সদস্য</div>
            <div className="text-xl font-extrabold text-amber-950">
              {data.users.filter(u => u.role === 'founder').length} জন
            </div>
            <div className="text-[10px] text-amber-700">শুধুমাত্র নিজস্ব প্রোফাইল এডিটর</div>
          </div>
        </div>
      </div>

      {/* User Accounts List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          সিস্টেমে নিবন্ধিত সকল ইউজার ({data.users.length} জন)
        </h3>

        {data.users.map(user => {
          const isCurrentActive = currentUser?.id === user.id;
          const isAdmin = user.role === 'admin';
          const isFounder = user.role === 'founder';
          const isSuperAdmin = user.role === 'super_admin';
          const userPerms = user.permissions || [];

          return (
            <div
              key={user.id}
              className={`p-5 rounded-2xl border transition-all ${
                isCurrentActive
                  ? 'border-emerald-500 bg-emerald-50/30 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* User Header Info Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm ${
                      isSuperAdmin
                        ? 'bg-emerald-900 text-amber-300'
                        : isAdmin
                        ? 'bg-blue-700 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {isSuperAdmin ? (
                      <Shield className="w-5 h-5" />
                    ) : isAdmin ? (
                      <Key className="w-5 h-5" />
                    ) : (
                      <UserCheck className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">{user.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isSuperAdmin
                            ? 'bg-emerald-800 text-amber-200'
                            : isAdmin
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {user.role === 'super_admin'
                          ? 'Super Admin (পূর্ণ অধিকার)'
                          : user.role === 'admin'
                          ? 'Admin (অনুমোদিত শাখা)'
                          : 'Founder (শুধুমাত্র প্রোফাইল)'}
                      </span>
                      {isCurrentActive && (
                        <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                          বর্তমানে লগইনকৃত
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-1 flex-wrap">
                      <span>ইমেইল: <strong className="text-slate-700">{user.email}</strong></span>
                      <span>•</span>
                      <span>ইউজারনেম: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono text-[11px]">{user.username}</code></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        স্ট্যাটাস:
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            user.isActive ? 'bg-emerald-500' : 'bg-red-400'
                          }`}
                        />
                        <strong className={user.isActive ? 'text-emerald-700' : 'text-red-600'}>
                          {user.isActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {!isCurrentActive && (
                    <button
                      onClick={() => handleSwitchUser(user)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
                      title="এই ইউজার হিসেবে ড্যাশবোর্ডে প্রবেশ করুন"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                      <span>টেস্ট লগইন</span>
                    </button>
                  )}

                  <button
                    onClick={() =>
                      updateUserAccount(user.id, { isActive: !user.isActive })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                      user.isActive
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {user.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                  </button>

                  {!isSuperAdmin && (
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                      title="ইউজার মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Specific Role Details & Permission Editor */}
              {isSuperAdmin ? (
                <div className="mt-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>
                    এই অ্যাকাউন্টের সম্পূর্ণ অ্যাক্সেস রয়েছে। সুপার অ্যাডমিন সকল মডিউল, ইউজার পারমিশন, ব্যাকআপ এবং সাধারণ সেটিংস পরিচালনা করতে পারেন।
                  </span>
                </div>
              ) : isFounder ? (
                <div className="mt-3 space-y-2">
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <span>
                        <strong>প্রতিষ্ঠাতা অ্যাক্সেস রুল:</strong> এই ইউজার লগইন করলে শুধুমাত্র তাঁর নিজস্ব প্রোফাইল ও জীবনী সম্পাদনা করতে পারবেন।
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold text-amber-950 whitespace-nowrap">
                        সংযুক্ত প্রোফাইল:
                      </label>
                      <select
                        value={user.linkedFounderId || ''}
                        onChange={e =>
                          updateUserAccount(user.id, { linkedFounderId: e.target.value })
                        }
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white font-medium text-slate-800"
                      >
                        {data.founders.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.name.bn} ({f.designation.bn})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                /* ADMIN ROLE: Granular Permission Checkboxes */
                <div className="mt-3 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-blue-700" />
                      <span>অ্যাডমিন পারমিশন সেটিংস (প্রদত্ত অধিকার: {userPerms.length} / {ALL_PERMISSIONS.length})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelectAllPermissions(user.id)}
                        className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100"
                      >
                        সব সিলেক্ট করুন
                      </button>
                      <button
                        onClick={() => handleDeselectAllPermissions(user.id)}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-200"
                      >
                        সব বাতিল করুন
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {ALL_PERMISSIONS.map(perm => {
                      const isGranted = userPerms.includes(perm.key);
                      const Icon = perm.icon;

                      return (
                        <button
                          key={perm.key}
                          onClick={() => handleTogglePermission(user.id, perm.key)}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                            isGranted
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon
                              className={`w-4 h-4 flex-shrink-0 ${
                                isGranted ? 'text-emerald-700' : 'text-slate-400'
                              }`}
                            />
                            <div className="truncate">
                              <div className="text-xs truncate">{perm.label}</div>
                              <div className="text-[10px] text-slate-400 font-normal">
                                {perm.category}
                              </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            {isGranted ? (
                              <CheckSquare className="w-4 h-4 text-emerald-700" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-800" />
                <span>নতুন ইউজার অ্যাকাউন্ট যুক্ত করুন</span>
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ব্যবহারকারীর ভূমিকা / রোল (Role) *</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                >
                  <option value="admin">সাধারণ অ্যাডমিন (Admin - নির্বাচিত শাখার নিয়ন্ত্রণ)</option>
                  <option value="founder">প্রতিষ্ঠাতা সদস্য (Founder - শুধুমাত্র নিজস্ব প্রোফাইল)</option>
                  <option value="super_admin">সুপার অ্যাডমিন (Super Admin - সম্পূর্ণ ক্ষমতা)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    placeholder="উদাঃ মোঃ রফিকুল ইসলাম"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ইউজারনেম</label>
                  <input
                    type="text"
                    value={newUserUsername}
                    onChange={e => setNewUserUsername(e.target.value)}
                    placeholder="admin_rafiq"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ইমেইল ঠিকানা *</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                    placeholder="rafiq@madrasa.edu.bd"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">প্রাথমিক পাসওয়ার্ড</label>
                  <input
                    type="password"
                    value={newUserPassword}
                    onChange={e => setNewUserPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {newUserRole === 'founder' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <label className="block font-bold text-amber-950">
                    কোন প্রতিষ্ঠাতা প্রোফাইলের সাথে লিংক করবেন?
                  </label>
                  <select
                    value={newUserLinkedFounderId}
                    onChange={e => setNewUserLinkedFounderId(e.target.value)}
                    className="w-full p-2 rounded-lg border border-amber-300 bg-white"
                  >
                    {data.founders.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name.bn} ({f.designation.bn})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-amber-800">
                    প্রতিষ্ঠাতা লগইন করলে সরাসরি উপরোক্ত প্রোফাইলটি সম্পাদনা করতে পারবেন।
                  </p>
                </div>
              )}

              {newUserRole === 'admin' && (
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">
                    প্রাথমিক পারমিশন নির্বাচন করুন:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                    {ALL_PERMISSIONS.map(perm => {
                      const checked = newUserPermissions.includes(perm.key);
                      return (
                        <label
                          key={perm.key}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setNewUserPermissions(prev =>
                                checked
                                  ? prev.filter(k => k !== perm.key)
                                  : [...prev, perm.key]
                              );
                            }}
                            className="rounded text-emerald-700"
                          />
                          <span className="text-[11px] text-slate-800 font-medium truncate">
                            {perm.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold shadow cursor-pointer"
                >
                  ইউজার যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="ইউজার অ্যাকাউন্ট মুছে ফেলা"
        itemName={deleteTarget ? `${deleteTarget.name} (${deleteTarget.email})` : undefined}
        message="আপনি কি নিশ্চিতভাবে এই ব্যবহারকারী অ্যাকাউন্টটি মুছে ফেলতে চান? মুছে ফেলার পর তিনি আর পোর্টালে লগইন করতে পারবেন না।"
        onConfirm={confirmDeleteUser}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
