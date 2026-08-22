import React, { useState } from 'react';
import {
  User as UserIcon,
  ShieldCheck,
  Database,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  LogIn,
  CheckCircle2,
  Lock,
  Globe,
  Sparkles,
} from 'lucide-react';
import { AuthUser, UserSettings } from '../types';
import { StorageService } from '../services/storageService';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  authUser: AuthUser | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  authUser,
  onOpenAuth,
  onSignOut,
  onResetData,
}) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleChange = (field: keyof UserSettings, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    StorageService.saveSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportJSON = () => {
    const jsonStr = StorageService.exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memorymap-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        StorageService.importDataJSON(text);
        setSyncStatus('Data imported successfully! Reloading...');
        setTimeout(() => window.location.reload(), 1200);
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Account & Cloud Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your personal profile, cloud authentication, and Firestore database sync.
          </p>
        </div>

        {authUser ? (
          <button
            onClick={onSignOut}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>

      {/* Cloud Authentication & Database Status Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#11111A] to-[#161626] border border-violet-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Cloud Firestore Database</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time worldwide sync active on Google Cloud Firestore
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-[#0A0A0F]/80 p-3 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500 font-medium">Auth Status:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {authUser ? (authUser.isAnonymous ? 'Guest Auth' : 'Authenticated') : 'Local Mode'}
              </span>
            </div>
            {authUser && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500 font-medium">UID:</span>
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[150px]">
                  {authUser.uid}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings Form */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#11111A] border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-violet-400" />
              <span>User Profile</span>
            </h2>
            {isSaved && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Changes Saved</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => handleChange('userName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0F] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Title / Headline
                </label>
                <input
                  type="text"
                  value={formData.userTitle}
                  onChange={(e) => handleChange('userTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0F] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bio & Vision
              </label>
              <textarea
                rows={3}
                value={formData.userBio}
                onChange={(e) => handleChange('userBio', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0F] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={formData.userAvatar}
                onChange={(e) => handleChange('userAvatar', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0F] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Data Management & Backup */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#11111A] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Cloud className="w-4 h-4 text-violet-400" />
              <span>Data Export & Backup</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export your entire worldwide memory collection as JSON or restore backups anytime.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleExportJSON}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0A0A0F] hover:bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-violet-400" />
                <span>Export JSON Backup</span>
              </button>

              <label className="w-full py-2.5 px-4 rounded-xl bg-[#0A0A0F] hover:bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Import JSON Data</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>

            {syncStatus && (
              <p className="text-[11px] text-emerald-400 font-medium text-center">{syncStatus}</p>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-[#11111A] border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-slate-400" />
              <span>Reset Sample Data</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Restore default worldwide memories across Paris, Tokyo, New York, London, and Mumbai.
            </p>
            <button
              onClick={onResetData}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
