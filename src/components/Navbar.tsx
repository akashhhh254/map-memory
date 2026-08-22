import React from 'react';
import {
  Compass,
  Search,
  Plus,
  Moon,
  Sun,
  Award,
  Sparkles,
  MapPin,
  Menu,
  Share2,
} from 'lucide-react';
import { AppView, UserSettings } from '../types';

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
}) => {
  const firstName = settings.userName.split(' ')[0] || 'Akash';

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
            <h1 className="text-white font-bold text-base sm:text-lg">
              Good morning, {firstName} 👋
            </h1>
            <p className="text-slate-500 text-xs hidden sm:block">
              You have {memoryCount} memories mapped across your personal network.
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
      <div className="flex items-center gap-3">
        {/* Product Tour / Guide CTA */}
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
            className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-lg shadow-violet-500/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Dashboard</span>
          </button>
        ) : (
          <button
            onClick={onOpenCreate}
            className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-lg shadow-violet-500/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Memory</span>
          </button>
        )}

        {/* User avatar */}
        <button
          onClick={() => onNavigate('settings')}
          className="w-9 h-9 rounded-full overflow-hidden bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs hover:ring-2 hover:ring-violet-500 transition-all shrink-0"
          title={`${settings.userName}`}
        >
          {settings.userName.charAt(0)}
        </button>
      </div>
    </header>
  );
};
