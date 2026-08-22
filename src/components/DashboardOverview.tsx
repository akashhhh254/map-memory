import React from 'react';
import {
  Sparkles,
  MapPin,
  Users,
  Image as ImageIcon,
  Compass,
  ArrowRight,
  Plus,
  Calendar,
  Award,
  GitFork,
  Heart,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { AppView, Memory, Person, UserSettings } from '../types';

interface DashboardOverviewProps {
  memories: Memory[];
  people: Person[];
  onNavigate: (view: AppView) => void;
  onSelectMemory: (memory: Memory) => void;
  onOpenCreate: () => void;
  settings: UserSettings;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  memories,
  people,
  onNavigate,
  onSelectMemory,
  onOpenCreate,
  settings,
}) => {
  // Calculate unique places count
  const uniqueCities = new Set(memories.map((m) => m.location.city));
  const totalPhotos = memories.reduce((acc, m) => acc + (m.photos?.length || 0), 0);

  const stats = [
    {
      label: 'TOTAL MEMORIES',
      value: memories.length,
      icon: Sparkles,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
      change: '+4 this month',
    },
    {
      label: 'PLACES VISITED',
      value: uniqueCities.size,
      icon: MapPin,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      change: 'Paris, Tokyo, New York, London...',
    },
    {
      label: 'CONNECTED PEOPLE',
      value: people.length,
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      change: '8 core companions',
    },
    {
      label: 'ARCHIVED PHOTOS',
      value: totalPhotos || 56,
      icon: ImageIcon,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
      change: 'High-res gallery',
    },
  ];

  // Most recent 4 memories
  const recentMemories = [...memories]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  // Spotlight memory (Milestone or recent)
  const spotlightMemory = memories[0] || recentMemories[0];

  const getPersonNames = (ids: string[]) => {
    return ids
      .map((id) => people.find((p) => p.id === id)?.name)
      .filter(Boolean);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Greeting & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Dashboard Overview
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Live Network
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personal memory intelligence graph & geographical footprint.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('map')}
            className="px-4 py-2 rounded-lg bg-[#11111A] hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            <Compass className="w-4 h-4 text-violet-400" />
            <span>Open Map View</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Memory</span>
          </button>
        </div>
      </div>

      {/* 4 Sleek Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#11111A] border border-slate-800 hover:border-slate-700 transition-all shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</span>
                <div className={`p-2 rounded-xl border ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium truncate">
                  <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured AI Spotlight & Quick Graph Launch */}
      {spotlightMemory && (
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-[#11111A] border border-violet-500/20 shadow-2xl shadow-violet-950/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Story Spotlight
                </span>
                <span className="text-xs text-slate-400">
                  📍 {spotlightMemory.location.placeName}, {spotlightMemory.location.city}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-bold text-white leading-tight">
                {spotlightMemory.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed bg-[#0A0A0F] p-3.5 rounded-xl border border-slate-800">
                “{spotlightMemory.aiSummary || spotlightMemory.story}”
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => onSelectMemory(spotlightMemory)}
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center gap-1.5"
                >
                  <span>Explore Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigate('graph')}
                  className="px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <GitFork className="w-3.5 h-3.5 text-violet-400" />
                  <span>View in Memory Graph</span>
                </button>
              </div>
            </div>

            {spotlightMemory.photos?.[0] && (
              <div className="lg:col-span-4 rounded-2xl overflow-hidden shadow-xl ring-1 ring-violet-500/20 max-h-56">
                <img
                  src={spotlightMemory.photos[0]}
                  alt={spotlightMemory.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Memories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-white">
              Recent Memories
            </h2>
            <p className="text-xs text-slate-400">
              Your latest captured journeys and moments
            </p>
          </div>

          <button
            onClick={() => onNavigate('memories')}
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            <span>View All ({memories.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentMemories.map((mem) => {
            const personNames = getPersonNames(mem.peopleIds);
            return (
              <div
                key={mem.id}
                onClick={() => onSelectMemory(mem)}
                className="group cursor-pointer rounded-2xl bg-[#11111A] border border-slate-800 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-950/20 transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Photo Preview */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  {mem.photos?.[0] ? (
                    <img
                      src={mem.photos[0]}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0A0A0F]/80 text-white backdrop-blur-md border border-slate-700/80">
                    {mem.category}
                  </span>
                  {mem.photos && mem.photos.length > 1 && (
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#0A0A0F]/80 text-slate-300 backdrop-blur-md">
                      +{mem.photos.length - 1} photos
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                      {mem.title}
                    </h3>
                    <p className="text-[11px] text-violet-300 flex items-center gap-1 font-medium truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{mem.location.placeName}, {mem.location.city}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{new Date(mem.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                  </div>

                  {/* People & Tags */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    {personNames.length > 0 && (
                      <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                        <Users className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="truncate">{personNames.slice(0, 2).join(', ')}{personNames.length > 2 ? ` +${personNames.length - 2}` : ''}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {mem.tags.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
