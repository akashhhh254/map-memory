import React from 'react';
import {
  LayoutDashboard,
  Map,
  Clock,
  Sparkles,
  Users,
  FolderHeart,
  Image as ImageIcon,
  GitFork,
  BarChart3,
  X,
  ChevronRight,
  BookOpen,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { AppView, AuthUser, UserSettings } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  memoryCount: number;
  peopleCount: number;
  placesCount: number;
  settings: UserSettings;
  authUser: AuthUser | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  isNew?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  memoryCount,
  peopleCount,
  placesCount,
  settings,
  authUser,
  onOpenAuth,
  onSignOut,
}) => {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Memory Map', icon: Map, badge: placesCount },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'memories', label: 'Memories', icon: Sparkles, badge: memoryCount },
    { id: 'people', label: 'People', icon: Users, badge: peopleCount },
    { id: 'collections', label: 'Collections', icon: FolderHeart },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'graph', label: 'Memory Graph', icon: GitFork, isNew: true },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
  ];

  const handleItemClick = (view: AppView) => {
    onNavigate(view);
    onCloseMobile();
  };

  const displayName = authUser?.displayName || settings.userName;
  const userEmail = authUser?.email || 'Guest Explorer';

  const content = (
    <div className="flex flex-col h-full justify-between p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Sleek Logo Area */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleItemClick('landing')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-600/30 group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            <span className="text-white font-bold tracking-tight text-lg font-display">
              MEMORY MAP
            </span>
          </button>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Platform Views
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${
                  isActive
                    ? 'bg-violet-600/10 text-violet-400 border border-violet-600/20 font-medium'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.isNew && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      GRAPH
                    </span>
                  )}
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                        isActive
                          ? 'bg-violet-500/20 text-violet-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Secondary section: Landing view link */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={() => handleItemClick('landing')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentView === 'landing'
                ? 'bg-violet-600/10 text-violet-400 border border-violet-600/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span>SaaS Landing Page</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Bottom Profile & Auth Status Card */}
      <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
        {authUser ? (
          <div className="p-3 rounded-2xl bg-[#0A0A0F] border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300 font-bold shrink-0 text-xs">
                {authUser.photoURL ? (
                  <img
                    src={authUser.photoURL}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-bold truncate">{displayName}</p>
                <p className="text-slate-400 text-[10px] truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{userEmail}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
              <button
                onClick={() => handleItemClick('settings')}
                className="flex-1 py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 transition-colors text-center"
              >
                Settings
              </button>
              <button
                onClick={onSignOut}
                className="py-1 px-2 rounded-lg hover:bg-rose-500/10 text-[11px] font-semibold text-rose-400 transition-colors flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-950/30 to-indigo-950/20 border border-violet-500/30 space-y-2">
            <div className="flex items-center gap-2 text-violet-300 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Cloud Storage & Sync</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Sign in to automatically save and sync your worldwide memories in Firebase Firestore.
            </p>
            <button
              onClick={onOpenAuth}
              className="w-full mt-1 bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 bg-[#11111A] border-r border-slate-800 flex-col z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#0A0A0F]/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 bg-[#11111A] border-r border-slate-800">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

