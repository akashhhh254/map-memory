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
  Settings,
  X,
  Compass,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { AppView, UserSettings } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  memoryCount: number;
  peopleCount: number;
  placesCount: number;
  settings: UserSettings;
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

      {/* Bottom Profile & Pro Upgrade Card */}
      <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            {settings.userName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">{settings.userName}</p>
            <p className="text-slate-500 text-xs truncate">Premium Member</p>
          </div>
        </div>

        {/* Sleek Upgrade Pro Card */}
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-4 rounded-xl text-white shadow-lg shadow-violet-900/30">
          <p className="text-xs font-semibold uppercase opacity-80 mb-1">Upgrade</p>
          <p className="text-sm font-bold mb-2">Unlimited Memories</p>
          <button
            onClick={() => handleItemClick('insights')}
            className="w-full bg-white text-violet-700 py-1.5 rounded-lg text-xs font-bold hover:bg-violet-50 transition-colors shadow-sm"
          >
            Go Pro
          </button>
        </div>
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
