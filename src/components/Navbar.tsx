import React from 'react';
import {
  Search,
  Plus,
  Sparkles,
  Menu,
  LogIn,
  LogOut,
  ShieldCheck,
  User as UserIcon,
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
  onToggleTheme,
  onToggleMobileSidebar,
  memoryCount,
  authUser,
  onOpenAuth,
  onSignOut,
}) => {
  const displayName = authUser?.displayName || settings.userName.split(' ')[0] || 'Explorer';

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-slate-800 bg-[#0A0A0F]/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="flex items-center gap-3">
        {currentView !== 'landing' && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Dynamic Header Greeting or Brand */}
        {currentView === 'landing' ? (
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-600/30 group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-white">
                MEMORY MAP
              </span>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Every Place Has a Story.
              </p>
            </div>
          </button>
        ) : (
          <div>
            <h1 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
              <span>Welcome, {displayName}</span>
              {authUser && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Cloud Auth</span>
                </span>
              )}
            </h1>
            <p className="text-slate-500 text-xs hidden sm:block">
              You have {memoryCount} memories mapped across your worldwide network.
            </p>
          </div>
        )}
      </div>

      {/* Center Search Input */}
      {currentView !== 'landing' && (
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium bg-[#11111A]/90 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-violet-400" />
              <span>Search locations, memories, people...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Product Tour CTA */}
        <button
          onClick={onOpenJudgeTour}
          className="bg-violet-500/10 text-violet-300 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border border-violet-500/20 flex items-center gap-1.5 hover:bg-violet-500/20 transition-all cursor-pointer"
          title="Explore Product Features"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="hidden sm:inline">PRODUCT TOUR</span>
          <span className="sm:hidden">TOUR</span>
        </button>

        {currentView === 'landing' ? (
          <button
            onClick={() => onNavigate('overview')}
            className="bg-violet-600 hover:bg-violet-500 text-white px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-lg shadow-violet-500/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch App</span>
          </button>
        ) : (
          <button
            onClick={onOpenCreate}
            className="bg-violet-600 hover:bg-violet-500 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-lg shadow-violet-500/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">+ Create Memory</span>
            <span className="sm:hidden">+ Add</span>
          </button>
        )}

        {/* Auth / Account Profile Button */}
        {authUser ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('settings')}
              className="w-9 h-9 rounded-full overflow-hidden bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300 font-bold text-xs hover:ring-2 hover:ring-violet-500 transition-all shrink-0"
              title={`${authUser.displayName || authUser.email || 'User Account'}`}
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
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors hidden sm:flex items-center justify-center"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3 py-2 rounded-xl bg-[#11111A] hover:bg-slate-800 border border-violet-500/30 text-violet-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
