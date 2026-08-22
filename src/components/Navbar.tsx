import React from 'react';
import {
  Search,
  Plus,
  Sparkles,
  Menu,
  LogIn,
  LogOut,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { AppView, AuthUser, UserSettings } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenCreate: () => void;
  onOpenSearch: () => void;
  onOpenJudgeTour: () => void;
  settings: UserSettings;
  onToggleTheme: () => void;
  onToggleMobileSidebar: () => void;
  memoryCount: number;
  authUser: AuthUser | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCreate,
  onOpenSearch,
  onOpenJudgeTour,
  settings,
  onToggleMobileSidebar,
  memoryCount,
  authUser,
  onOpenAuth,
  onSignOut,
}) => {
  const displayName = authUser?.displayName || settings.userName.split(' ')[0] || 'Explorer';

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-white/[0.06] bg-[#0C0D12]/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="flex items-center gap-3">
        {currentView !== 'landing' && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded text-stone-400 hover:text-stone-200 hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Dynamic Header Greeting or Brand */}
        {currentView === 'landing' ? (
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-900 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-semibold text-sm tracking-tight text-stone-100 block">
                MEMORY MAP
              </span>
              <p className="text-[11px] text-stone-500 font-mono hidden sm:block">
                Atlas of Life Moments
              </p>
            </div>
          </button>
        ) : (
          <div>
            <h1 className="text-stone-100 font-semibold text-sm sm:text-base flex items-center gap-2">
              <span>{displayName}'s Atlas</span>
              {authUser && (
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Synced</span>
                </span>
              )}
            </h1>
            <p className="text-stone-500 text-[11px] font-mono hidden sm:block">
              {memoryCount} memories archived worldwide
            </p>
          </div>
        )}
      </div>

      {/* Center Search Input */}
      {currentView !== 'landing' && (
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-md text-xs font-normal bg-stone-900/80 border border-white/[0.08] text-stone-400 hover:text-stone-200 hover:border-white/[0.15] transition-all shadow-sm cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-amber-400/80" />
              <span>Search places, stories, companions...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-stone-800 text-stone-400 border border-stone-700">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Product Tour CTA */}
        <button
          onClick={onOpenJudgeTour}
          className="bg-stone-900 hover:bg-stone-800 text-stone-300 px-3 py-1.5 rounded text-xs font-medium border border-white/[0.08] flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Explore Product Architecture"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Product Tour</span>
          <span className="sm:hidden">Tour</span>
        </button>

        {currentView === 'landing' ? (
          <button
            onClick={() => onNavigate('overview')}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-3.5 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Open Atlas</span>
          </button>
        ) : (
          <button
            onClick={onOpenCreate}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-3 sm:px-3.5 py-1.5 rounded text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Memory</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}

        {/* Auth / Account Profile Button */}
        {authUser ? (
          <div className="flex items-center gap-1.5 ml-1">
            <button
              onClick={() => onNavigate('settings')}
              className="w-8 h-8 rounded-md overflow-hidden bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-200 font-semibold text-xs hover:border-amber-500 transition-colors shrink-0 cursor-pointer"
              title={`${authUser.displayName || authUser.email || 'Account Settings'}`}
            >
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
            </button>
            <button
              onClick={onSignOut}
              className="p-1.5 rounded text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors hidden sm:flex items-center justify-center cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 border border-white/[0.08] text-stone-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-amber-400" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
