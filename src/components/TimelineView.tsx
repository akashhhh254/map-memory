import React, { useState, useMemo } from 'react';
import {
  Clock,
  MapPin,
  Calendar,
  Users,
  Tag,
  ArrowUpDown,
  Filter,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { Memory, MemoryCategory, Person, UserSettings } from '../types';

interface TimelineViewProps {
  memories: Memory[];
  people: Person[];
  onSelectMemory: (memory: Memory) => void;
  settings: UserSettings;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  memories,
  people,
  onSelectMemory,
  settings,
}) => {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Extract all distinct years
  const distinctYears = useMemo(() => {
    const years = new Set(memories.map((m) => m.date.slice(0, 4)));
    return Array.from(years).sort().reverse();
  }, [memories]);

  // Filter & sort memories
  const sortedAndFiltered = useMemo(() => {
    let filtered = memories.filter((mem) => {
      if (selectedCategory !== 'all' && mem.category !== selectedCategory) return false;
      if (selectedYear !== 'all' && !mem.date.startsWith(selectedYear)) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [memories, sortOrder, selectedCategory, selectedYear]);

  // Group by year
  const groupedByYear: Record<string, Memory[]> = useMemo(() => {
    const groups: Record<string, Memory[]> = {};
    sortedAndFiltered.forEach((mem) => {
      const year = mem.date.slice(0, 4);
      if (!groups[year]) groups[year] = [];
      groups[year].push(mem);
    });
    return groups;
  }, [sortedAndFiltered]);

  const getPersonNames = (ids: string[]) => {
    return ids
      .map((id) => people.find((p) => p.id === id)?.name)
      .filter(Boolean);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span>Chronological Journey</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          “Your Life, One Place at a Time.”
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Trace your personal evolution, travels, and milestone memories in sequence.
        </p>
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#11111A] border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          {/* Sort Order Toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-violet-400" />
            <span>{sortOrder === 'newest' ? 'Newest → Oldest' : 'Oldest → Newest'}</span>
          </button>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="all">All Years</option>
            {distinctYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {['all', 'Travel', 'College', 'Friends', 'Work', 'Family', 'Food'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-12 relative before:absolute before:inset-0 before:left-6 sm:before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-gradient-to-b before:from-violet-500 before:via-slate-800 before:to-transparent">
        {Object.entries(groupedByYear).map(([year, yearMemories]) => (
          <div key={year} className="space-y-8 relative">
            {/* Year Anchor Badge */}
            <div className="flex items-center justify-start sm:justify-center relative z-10 pl-2 sm:pl-0">
              <div className="px-4 py-1.5 rounded-full bg-[#11111A] border-2 border-violet-500 text-violet-200 font-display font-extrabold text-sm shadow-xl shadow-violet-950/40">
                {year}
              </div>
            </div>

            {/* Memories in this year */}
            <div className="space-y-8">
              {yearMemories.map((mem, index) => {
                const isEven = index % 2 === 0;
                const personNames = getPersonNames(mem.peopleIds);

                return (
                  <div
                    key={mem.id}
                    className={`relative flex flex-col sm:flex-row items-start ${
                      isEven ? 'sm:flex-row-reverse' : ''
                    } gap-6 sm:gap-8 group pl-12 sm:pl-0`}
                  >
                    {/* Central Marker Dot */}
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 top-4 w-4 h-4 rounded-full bg-slate-950 border-2 border-violet-400 z-10 shadow-lg group-hover:scale-125 group-hover:bg-violet-600 transition-all duration-300" />

                    {/* Timeline Card */}
                    <div
                      onClick={() => onSelectMemory(mem)}
                      className="w-full sm:w-[calc(50%-2rem)] p-5 rounded-3xl bg-[#11111A] border border-slate-800 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-950/30 transition-all cursor-pointer space-y-3"
                    >
                      {/* Photo Header */}
                      {mem.photos?.[0] && (
                        <div className="h-40 w-full rounded-2xl overflow-hidden bg-slate-950">
                          <img
                            src={mem.photos[0]}
                            alt={mem.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Header Info */}
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-violet-300 font-bold">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{mem.location.city}, {mem.location.country}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(mem.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </span>
                      </div>

                      {/* Title & Story Preview */}
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                          {mem.title}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {mem.story}
                        </p>
                      </div>

                      {/* AI Summary Quote (if available) */}
                      {mem.aiSummary && (
                        <p className="text-[11px] text-violet-200/90 italic bg-[#0A0A0F] p-2.5 rounded-xl border border-violet-500/20">
                          “{mem.aiSummary}”
                        </p>
                      )}

                      {/* Footer tags and companions */}
                      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                        {personNames.length > 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-indigo-300 font-medium">
                            <Users className="w-3 h-3" />
                            <span>{personNames.join(' • ')}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          {mem.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium"
                            >
                              #{tag}
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
        ))}
      </div>
    </div>
  );
};
