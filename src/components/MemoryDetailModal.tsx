import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Sparkles,
  Share2,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  Compass,
  Tag,
  Heart,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { Memory, Person, UserSettings } from '../types';

interface MemoryDetailModalProps {
  memory: Memory | null;
  onClose: () => void;
  people: Person[];
  onDeleteMemory: (id: string) => void;
  onCenterOnMap: (memory: Memory) => void;
  onOpenShare: (memory: Memory) => void;
  settings: UserSettings;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  memory,
  onClose,
  people,
  onDeleteMemory,
  onCenterOnMap,
  onOpenShare,
  settings,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!memory) return null;

  const connectedPeople = people.filter((p) => memory.peopleIds.includes(p.id));

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${memory.title}"?`)) {
      onDeleteMemory(memory.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between">
        {/* Header Action Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {memory.category}
            </span>
            {memory.eventName && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                🎉 {memory.eventName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenShare(memory)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Share Memory"
            >
              <Share2 className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={() => {
                onCenterOnMap(memory);
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="View on Interactive Map"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Map</span>
            </button>

            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 text-xs transition-colors"
              title="Delete Memory"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Photo Gallery Carousel */}
          {memory.photos && memory.photos.length > 0 && (
            <div className="space-y-2">
              <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden bg-slate-950 ring-1 ring-slate-800">
                <img
                  src={memory.photos[activePhotoIdx]}
                  alt={memory.title}
                  className="w-full h-full object-cover"
                />

                {memory.photos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActivePhotoIdx((prev) =>
                          prev === 0 ? memory.photos!.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 text-white backdrop-blur-md"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setActivePhotoIdx((prev) =>
                          (prev + 1) % memory.photos!.length
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 text-white backdrop-blur-md"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-md">
                      {activePhotoIdx + 1} / {memory.photos.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {memory.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {memory.photos.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`h-14 w-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activePhotoIdx === idx
                          ? 'border-purple-500 ring-2 ring-purple-500/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={p} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Title & Metadata */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              {memory.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-purple-300 font-semibold">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>{memory.location.placeName}, {memory.location.city} ({memory.location.country})</span>
              </span>

              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{new Date(memory.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </span>
            </div>
          </div>

          {/* AI Emotional Summary Banner */}
          {memory.aiSummary && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Memory Intelligence Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/90 italic leading-relaxed">
                “{memory.aiSummary}”
              </p>
            </div>
          )}

          {/* Full Story */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              The Story & Experience
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
              {memory.story}
            </p>
          </div>

          {/* Connected People Cards */}
          {connectedPeople.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Connected People ({connectedPeople.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {connectedPeople.map((person) => (
                  <div
                    key={person.id}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3"
                  >
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-purple-500/30"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="font-bold text-white truncate">{person.name}</p>
                      <p className="text-[11px] text-purple-300 truncate">{person.relation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {memory.tags && memory.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tags & Descriptors
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {memory.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-slate-800 text-purple-300 text-xs font-medium border border-slate-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
