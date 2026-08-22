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
  GitFork,
  ArrowUpRight,
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
}) => {
  // Calculate unique places count
  const uniqueCities = new Set(memories.map((m) => m.location.city));
  const totalPhotos = memories.reduce((acc, m) => acc + (m.photos?.length || 0), 0);

  const stats = [
    {
      label: 'Archived Memories',
      value: memories.length,
      unit: 'stories',
      change: 'Active Archive',
    },
    {
      label: 'Global Footprint',
      value: uniqueCities.size,
      unit: 'cities',
      change: 'Worldwide pins',
    },
    {
      label: 'Companions & Friends',
      value: people.length,
      unit: 'people',
      change: 'Connected graph',
    },
    {
      label: 'Photo Assets',
      value: totalPhotos || 56,
      unit: 'photographs',
      change: 'Visual log',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-stone-100 tracking-tight">
              Life Atlas & Intelligence
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-medium rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Personal Archive
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Personal memory intelligence graph, journey log, and geographical footprint.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('map')}
            className="px-3.5 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-200 border border-white/[0.08] text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Map</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition-colors flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Architectural Metric Panel (Integrated Bar) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 rounded-lg bg-[#12141C] border border-white/[0.07] divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06] overflow-hidden shadow-sm">
        {stats.map((stat, idx) => {
          return (
            <div key={idx} className="p-5 space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block">
                {stat.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-semibold font-mono text-stone-100 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs text-stone-500 font-mono">{stat.unit}</span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono pt-1">
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Featured Editorial Spotlight */}
      {spotlightMemory && (
        <div className="rounded-lg p-6 sm:p-7 bg-[#13151D] border border-white/[0.08] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs text-stone-400 font-mono">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Featured Story
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-500" />
                  {spotlightMemory.location.placeName}, {spotlightMemory.location.city}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-normal text-stone-100 leading-tight">
                {spotlightMemory.title}
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 font-serif italic leading-relaxed bg-stone-900/60 p-4 rounded border border-white/[0.06]">
                “{spotlightMemory.aiSummary || spotlightMemory.story}”
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => onSelectMemory(spotlightMemory)}
                  className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Full Chronicle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigate('graph')}
                  className="px-3.5 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <GitFork className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect in Relationship Graph</span>
                </button>
              </div>
            </div>

            {spotlightMemory.photos?.[0] && (
              <div className="lg:col-span-4 rounded-md overflow-hidden border border-white/[0.08] max-h-56">
                <img
                  src={spotlightMemory.photos[0]}
                  alt={spotlightMemory.title}
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Field Memories Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base sm:text-lg font-display font-semibold text-stone-100">
              Recent Dispatches & Memories
            </h2>
            <p className="text-xs text-stone-400">
              Chronological log of recent travels and captured moments
            </p>
          </div>

          <button
            onClick={() => onNavigate('memories')}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All ({memories.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Card Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentMemories.map((mem) => {
            const personNames = getPersonNames(mem.peopleIds);
            return (
              <div
                key={mem.id}
                onClick={() => onSelectMemory(mem)}
                className="group cursor-pointer rounded-lg bg-[#12141C] border border-white/[0.07] hover:border-white/[0.18] transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Photo Preview */}
                <div className="relative h-40 w-full overflow-hidden bg-stone-950">
                  {mem.photos?.[0] ? (
                    <img
                      src={mem.photos[0]}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-600 bg-stone-900">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                  )}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider bg-stone-900/90 text-stone-200 border border-white/[0.1]">
                    {mem.category}
                  </span>
                  {mem.photos && mem.photos.length > 1 && (
                    <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-stone-900/90 text-stone-300 border border-white/[0.1]">
                      +{mem.photos.length - 1} photos
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-stone-200 group-hover:text-amber-300 transition-colors line-clamp-1">
                        {mem.title}
                      </h3>
                      <ArrowUpRight className="w-3 h-3 text-stone-500 group-hover:text-amber-400 shrink-0 transition-colors" />
                    </div>
                    <p className="text-[11px] text-stone-400 flex items-center gap-1 font-mono truncate">
                      <MapPin className="w-3 h-3 text-amber-500/80 shrink-0" />
                      <span className="truncate">{mem.location.placeName}, {mem.location.city}</span>
                    </p>
                    <p className="text-[10px] text-stone-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{new Date(mem.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                  </div>

                  {/* People & Tags */}
                  <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                    {personNames.length > 0 && (
                      <p className="text-[10px] text-stone-400 truncate flex items-center gap-1">
                        <Users className="w-3 h-3 text-stone-500 shrink-0" />
                        <span className="truncate">{personNames.slice(0, 2).join(', ')}{personNames.length > 2 ? ` +${personNames.length - 2}` : ''}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {mem.tags.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-stone-900 text-stone-400 font-mono border border-white/[0.04]"
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
