import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Compass,
  Tag,
  FolderHeart,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { Collection, Memory, MemoryCategory, Person, UserSettings } from '../types';

interface MemoriesListViewProps {
  memories: Memory[];
  people: Person[];
  collections: Collection[];
  onSelectMemory: (memory: Memory) => void;
  onOpenCreate: () => void;
  onOpenShare: (memory: Memory) => void;
  onCenterOnMap: (memory: Memory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  settings: UserSettings;
}

export const MemoriesListView: React.FC<MemoriesListViewProps> = ({
  memories,
  people,
  collections,
  onSelectMemory,
  onOpenCreate,
  onOpenShare,
  onCenterOnMap,
  searchQuery,
  onSearchChange,
  settings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPersonId, setSelectedPersonId] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'az'>('newest');

  // Cities list
  const cities = useMemo(() => {
    return Array.from(new Set(memories.map((m) => m.location.city)));
  }, [memories]);

  // Filtered & Sorted memories
  const filteredMemories = useMemo(() => {
    return memories
      .filter((mem) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const personNames = mem.peopleIds
            .map((id) => people.find((p) => p.id === id)?.name || '')
            .join(' ')
            .toLowerCase();

          const matches =
            mem.title.toLowerCase().includes(q) ||
            mem.story.toLowerCase().includes(q) ||
            mem.location.placeName.toLowerCase().includes(q) ||
            mem.location.city.toLowerCase().includes(q) ||
            mem.category.toLowerCase().includes(q) ||
            mem.tags.some((t) => t.toLowerCase().includes(q)) ||
            personNames.includes(q);

          if (!matches) return false;
        }

        // Filters
        if (selectedCategory !== 'all' && mem.category !== selectedCategory) return false;
        if (selectedPersonId !== 'all' && !mem.peopleIds.includes(selectedPersonId))
          return false;
        if (selectedCity !== 'all' && mem.location.city !== selectedCity) return false;
        if (
          selectedCollectionId !== 'all' &&
          mem.collectionId !== selectedCollectionId
        )
          return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (sortBy === 'oldest') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        } else {
          return a.title.localeCompare(b.title);
        }
      });
  }, [
    memories,
    searchQuery,
    selectedCategory,
    selectedPersonId,
    selectedCity,
    selectedCollectionId,
    sortBy,
    people,
  ]);

  const getPersonNames = (ids: string[]) => {
    return ids
      .map((id) => people.find((p) => p.id === id)?.name)
      .filter(Boolean);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Memory Library
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {filteredMemories.length} Memories
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse, filter, and search across your entire documented journey.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-1.5 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Memory</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-[#11111A] border border-slate-800 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-violet-400" />
            <input
              type="text"
              placeholder="Search places, stories, companions, tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0A0A0F] text-white text-xs border border-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* City Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0A0A0F] text-slate-200 text-xs border border-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="all">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Person Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedPersonId}
              onChange={(e) => setSelectedPersonId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0A0A0F] text-slate-200 text-xs border border-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="all">All Companions</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Collection Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCollectionId}
              onChange={(e) => setSelectedCollectionId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0A0A0F] text-slate-200 text-xs border border-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="all">All Collections</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[#0A0A0F] text-slate-200 text-xs border border-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {['all', 'Travel', 'College', 'Friends', 'Work', 'Family', 'Food', 'Events'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'bg-[#0A0A0F] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Memories Grid */}
      {filteredMemories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((mem) => {
            const personNames = getPersonNames(mem.peopleIds);

            return (
              <div
                key={mem.id}
                onClick={() => onSelectMemory(mem)}
                className="group cursor-pointer rounded-3xl bg-[#11111A] border border-slate-800 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-950/30 transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Photo & Badge */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  {mem.photos?.[0] ? (
                    <img
                      src={mem.photos[0]}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Sparkles className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0A0A0F]/80 text-white backdrop-blur-md border border-slate-700">
                    {mem.category}
                  </span>
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#0A0A0F]/80 text-slate-300 backdrop-blur-md">
                    {mem.date}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                      {mem.title}
                    </h3>
                    <p className="text-xs text-violet-300 flex items-center gap-1 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{mem.location.placeName}, {mem.location.city}</span>
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-1">
                      {mem.aiSummary || mem.story}
                    </p>
                  </div>

                  {/* Footnote */}
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    {personNames.length > 0 && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                        <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{personNames.join(', ')}</span>
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex gap-1 overflow-hidden">
                        {mem.tags.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium truncate"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 text-violet-400 font-semibold shrink-0">
                        <span>Read Story</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-[#11111A] border border-slate-800 space-y-3">
          <Sparkles className="w-8 h-8 text-violet-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No memories matched your search</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search keywords or clearing active filters.
          </p>
        </div>
      )}
    </div>
  );
};
