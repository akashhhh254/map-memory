import React, { useMemo } from 'react';
import {
  BarChart3,
  MapPin,
  Users,
  Sparkles,
  Calendar,
  Compass,
  PieChart,
  TrendingUp,
  Award,
  Heart,
} from 'lucide-react';
import { Memory, MemoryCategory, Person, UserSettings } from '../types';

interface InsightsViewProps {
  memories: Memory[];
  people: Person[];
  settings: UserSettings;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  memories,
  people,
  settings,
}) => {
  // 1. Most Visited Cities
  const cityCounts = useMemo(() => {
    const counts: { [city: string]: number } = {};
    memories.forEach((m) => {
      const city = m.location.city;
      counts[city] = (counts[city] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([city, count]) => ({ city, count }));
  }, [memories]);

  // 2. Category Distribution
  const categoryCounts = useMemo(() => {
    const counts: { [cat in MemoryCategory]?: number } = {};
    memories.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => (b[1] || 0) - (a[1] || 0))
      .map(([category, count]) => ({ category, count: count || 0 }));
  }, [memories]);

  // 3. Memories by Year
  const yearCounts = useMemo(() => {
    const counts: { [yr: string]: number } = {};
    memories.forEach((m) => {
      const yr = m.date.slice(0, 4);
      counts[yr] = (counts[yr] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([year, count]) => ({ year, count }));
  }, [memories]);

  // 4. Most Connected People
  const topPeople = useMemo(() => {
    return people
      .map((p) => {
        const count = memories.filter((m) => m.peopleIds.includes(p.id)).length;
        const places = new Set(
          memories.filter((m) => m.peopleIds.includes(p.id)).map((m) => m.location.city)
        ).size;
        return { ...p, memoryCount: count, placesCount: places };
      })
      .sort((a, b) => b.memoryCount - a.memoryCount)
      .slice(0, 5);
  }, [memories, people]);

  const topCity = cityCounts[0]?.city || 'Nagpur';
  const topCategory = categoryCounts[0]?.category || 'Travel';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Memory Intelligence & Analytics
          </h1>
          <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Insights
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Pattern detection across your personal timeline, travel destinations, and relationships.
        </p>
      </div>

      {/* AI Key Insights Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-[#11111A] border border-violet-500/30 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-violet-600/10 border border-violet-500/30 text-violet-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Geographic Core Hub</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              “Most of your pivotal milestone memories were created in <strong className="text-violet-300">{topCity}</strong> ({(cityCounts[0]?.count || 0)} recorded memories), forming your central innovation and college network.”
            </p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#11111A] border border-emerald-500/30 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Dominant Life Theme</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              “<strong className="text-emerald-300">{topCategory}</strong> and Exploration is your most common memory theme, connecting coastal roads in Goa with Sahyadri fort treks in Pune.”
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Most Visited Places */}
        <div className="p-6 rounded-3xl bg-[#11111A] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Most Visited Places</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Memory Volume</span>
          </div>

          <div className="space-y-3 pt-2">
            {cityCounts.map((item, idx) => {
              const maxVal = cityCounts[0]?.count || 1;
              const percent = (item.count / maxVal) * 100;
              return (
                <div key={item.city} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.city}</span>
                    <span className="text-slate-400 font-mono">{item.count} memories</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#0A0A0F] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Memories by Category */}
        <div className="p-6 rounded-3xl bg-[#11111A] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-violet-400" />
              <span>Memories by Category</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Category Breakdown</span>
          </div>

          <div className="space-y-3 pt-2">
            {categoryCounts.map((item) => {
              const maxVal = categoryCounts[0]?.count || 1;
              const percent = (item.count / maxVal) * 100;
              return (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.category}</span>
                    <span className="text-slate-400 font-mono">{item.count}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#0A0A0F] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Memories by Year */}
        <div className="p-6 rounded-3xl bg-[#11111A] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Memories by Year</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Timeline Growth</span>
          </div>

          <div className="grid grid-cols-4 gap-3 pt-4">
            {yearCounts.map((item) => (
              <div
                key={item.year}
                className="p-4 rounded-2xl bg-[#0A0A0F] border border-slate-800 text-center space-y-1"
              >
                <p className="text-xs font-bold text-violet-400">{item.year}</p>
                <p className="text-2xl font-display font-extrabold text-white">{item.count}</p>
                <p className="text-[10px] text-slate-500">memories</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Most Connected People */}
        <div className="p-6 rounded-3xl bg-[#11111A] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-400" />
              <span>Top Companions & Collaboration</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Network Leaderboard</span>
          </div>

          <div className="space-y-3 pt-2">
            {topPeople.map((person, idx) => (
              <div
                key={person.id}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0A0A0F] border border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center text-xs font-mono font-bold text-slate-500">
                    #{idx + 1}
                  </span>
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-violet-500/30"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{person.name}</p>
                    <p className="text-[10px] text-slate-500">{person.relation}</p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <p className="font-bold text-violet-300">{person.memoryCount} memories</p>
                  <p className="text-[10px] text-slate-500">{person.placesCount} shared places</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
