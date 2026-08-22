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
  Compass,
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
    { id: 'people', label: 'People & Friends', icon: Users, badge: peopleCount },
    { id: 'collections', label: 'Collections', icon: FolderHeart },
    { id: 'gallery', label: 'Photo Archive', icon: ImageIcon },
    { id: 'graph', label: 'Memory Graph', icon: GitFork, isNew: true },
    { id: 'insights', label: 'Life Insights', icon: BarChart3 },
  ];

  const handleItemClick = (view: AppView) => {
    onNavigate(view);
    onCloseMobile();
  };

  const displayName = authUser?.displayName || settings.userName;
  const userEmail = authUser?.email || 'Guest Explorer';

  const content = (
    <div className="flex flex-col h-full justify-between p-4 overflow-y-auto bg-[#0F1118]">
      <div className="space-y-6">
        {/* Bespoke Logo Area */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <button
            onClick={() => handleItemClick('landing')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-900 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-stone-100 font-semibold tracking-tight text-sm font-display block">
                MEMORY MAP
              </span>
              <span className="text-[10px] tracking-wider uppercase text-stone-500 font-mono block">
                Atlas of Life
              </span>
            </div>
          </button>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-0.5">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 font-mono">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold'
                    : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-400' : 'text-stone-500 group-hover:text-stone-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.isNew && (
                    <span className="px-1.5 py-0.2 text-[9px] font-medium font-mono rounded bg-stone-800 text-stone-300 border border-stone-700">
                      GRAPH
                    </span>
                  )}
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-200'
                          : 'bg-stone-800/80 text-stone-400'
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
        <div className="pt-2 border-t border-white/[0.06]">
          <button
            onClick={() => handleItemClick('landing')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors cursor-pointer ${
              currentView === 'landing'
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium'
                : 'text-stone-400 hover:bg-white/[0.04] hover:text-stone-200 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-stone-400" />
              <span>Product Editorial</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
          </button>
        </div>
      </div>

      {/* Bottom Profile & Auth Status Card */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-3">
        {authUser ? (
          <div className="p-3 rounded-lg bg-stone-900/80 border border-white/[0.07] space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md overflow-hidden bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 font-semibold shrink-0 text-xs">
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
                <p className="text-stone-200 text-xs font-semibold truncate">{displayName}</p>
                <p className="text-stone-400 text-[10px] truncate flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{userEmail}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
              <button
                onClick={() => handleItemClick('settings')}
                className="flex-1 py-1 px-2 rounded bg-stone-800 hover:bg-stone-700 text-[11px] font-medium text-stone-300 transition-colors text-center cursor-pointer"
              >
                Settings
              </button>
              <button
                onClick={onSignOut}
                className="py-1 px-2 rounded hover:bg-rose-500/10 text-[11px] font-medium text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-stone-900/60 border border-white/[0.07] space-y-2">
            <div className="flex items-center gap-1.5 text-stone-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cloud Sync</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Sync and preserve your memories safely in Firebase Cloud Firestore.
            </p>
            <button
              onClick={onOpenAuth}
              className="w-full mt-1 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white py-1.5 rounded text-xs font-semibold transition-colors border border-stone-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
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
      <aside className="hidden lg:flex w-60 shrink-0 h-[calc(100vh-4rem)] sticky top-16 bg-[#0F1118] border-r border-white/[0.06] flex-col z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#0C0D12]/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 bg-[#0F1118] border-r border-white/[0.08]">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

