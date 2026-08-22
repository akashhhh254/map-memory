import React, { useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  MapPin,
  Calendar,
  Sparkles,
  Filter,
  Maximize2,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import { Memory, Person, UserSettings } from '../types';

interface GalleryViewProps {
  memories: Memory[];
  people: Person[];
  onSelectMemory: (memory: Memory) => void;
  settings: UserSettings;
}

interface GalleryItem {
  photoUrl: string;
  memory: Memory;
  photoIndex: number;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  memories,
  people,
  onSelectMemory,
  settings,
}) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');

  // Flatten all photos into gallery items
  const allPhotos: GalleryItem[] = useMemo(() => {
    const items: GalleryItem[] = [];
    memories.forEach((mem) => {
      mem.photos?.forEach((url, pIdx) => {
        items.push({
          photoUrl: url,
          memory: mem,
          photoIndex: pIdx,
        });
      });
    });
    return items;
  }, [memories]);

  // Distinct cities and years
  const cities = useMemo(() => {
    return Array.from(new Set(memories.map((m) => m.location.city)));
  }, [memories]);

  const years = useMemo(() => {
    return Array.from(new Set(memories.map((m) => m.date.slice(0, 4)))).sort().reverse();
  }, [memories]);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return allPhotos.filter(({ memory }) => {
      if (filterCategory !== 'all' && memory.category !== filterCategory) return false;
      if (filterCity !== 'all' && memory.location.city !== filterCity) return false;
      if (filterYear !== 'all' && !memory.date.startsWith(filterYear)) return false;
      return true;
    });
  }, [allPhotos, filterCategory, filterCity, filterYear]);

  const currentLightboxItem = selectedItemIndex !== null ? filteredPhotos[selectedItemIndex] : null;

  const handleNextPhoto = () => {
    if (selectedItemIndex !== null) {
      setSelectedItemIndex((selectedItemIndex + 1) % filteredPhotos.length);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedItemIndex !== null) {
      setSelectedItemIndex(
        (selectedItemIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Visual Photo Gallery
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {filteredPhotos.length} Photos
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Every snapshot mapped to its geographic coordinates and emotional narrative.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* City filter */}
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#11111A] text-slate-200 text-xs font-semibold border border-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Year filter */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#11111A] text-slate-200 text-xs font-semibold border border-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="all">All Years</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {['all', 'Travel', 'College', 'Friends', 'Work', 'Family', 'Food'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'bg-[#11111A] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Masonry / Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedItemIndex(idx)}
            className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer bg-slate-950 border border-slate-800 hover:border-violet-500/60 shadow-lg transition-all"
          >
            <img
              src={item.photoUrl}
              alt={item.memory.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            {/* Hover overlay metadata */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
              <div className="flex justify-end">
                <span className="p-1.5 rounded-xl bg-slate-950/80 text-white border border-slate-700">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white line-clamp-1">{item.memory.title}</p>
                <p className="text-[10px] text-purple-300 flex items-center gap-1 font-medium">
                  <MapPin className="w-3 h-3" /> {item.memory.location.city}
                </p>
                <p className="text-[9px] text-slate-400">
                  📅 {new Date(item.memory.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {currentLightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedItemIndex(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev / Next buttons */}
          <button
            onClick={handlePrevPhoto}
            className="absolute left-6 p-3 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNextPhoto}
            className="absolute right-6 p-3 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Lightbox Content */}
          <div className="max-w-4xl w-full flex flex-col items-center space-y-4">
            <div className="max-h-[70vh] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-purple-500/40">
              <img
                src={currentLightboxItem.photoUrl}
                alt={currentLightboxItem.memory.title}
                className="max-h-[70vh] w-auto object-contain rounded-2xl"
              />
            </div>

            {/* Info Card */}
            <div className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left space-y-1">
                <h3 className="text-base font-bold text-white font-display">
                  {currentLightboxItem.memory.title}
                </h3>
                <p className="text-xs text-purple-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{currentLightboxItem.memory.location.placeName}, {currentLightboxItem.memory.location.city}</span>
                  <span className="text-slate-500">•</span>
                  <span>{currentLightboxItem.memory.date}</span>
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedItemIndex(null);
                  onSelectMemory(currentLightboxItem.memory);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Open Memory Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
