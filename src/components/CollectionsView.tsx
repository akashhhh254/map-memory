import React, { useState } from 'react';
import {
  FolderHeart,
  Plus,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  X,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Collection, Memory, UserSettings } from '../types';

interface CollectionsViewProps {
  collections: Collection[];
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onAddCollection: (collection: Collection) => void;
  onDeleteCollection: (id: string) => void;
  settings: UserSettings;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  collections,
  memories,
  onSelectMemory,
  onAddCollection,
  onDeleteCollection,
  settings,
}) => {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Curated collection of special memories.',
      coverImage: coverImage.trim(),
      color: '#8B5CF6',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddCollection(newCol);
    setName('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Memory Collections
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {collections.length} Curations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Group memories into custom chapters, chapters of life, and themed scrapbooks.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => {
          const colMemories = memories.filter((m) => m.collectionId === col.id);

          return (
            <div
              key={col.id}
              onClick={() => setSelectedCollection(col)}
              className="group cursor-pointer rounded-3xl bg-[#11111A] border border-slate-800 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-950/30 transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Cover Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={col.coverImage}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11111A] via-[#11111A]/30 to-transparent" />
                <span className="absolute bottom-3 left-4 text-lg font-bold font-display text-white">
                  {col.name}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0A0A0F]/80 text-violet-300 border border-violet-500/30 backdrop-blur-md">
                  {colMemories.length} Memories
                </span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {col.description}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-violet-400">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collection Detail Modal */}
      {selectedCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 overflow-y-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCollection.coverImage}
                  alt={selectedCollection.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500"
                />
                <div>
                  <h2 className="text-xl font-bold font-display text-white">{selectedCollection.name}</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-md">{selectedCollection.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCollection(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Memories in this collection */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">
                Memories in this collection ({memories.filter((m) => m.collectionId === selectedCollection.id).length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {memories
                  .filter((m) => m.collectionId === selectedCollection.id)
                  .map((mem) => (
                    <div
                      key={mem.id}
                      onClick={() => {
                        setSelectedCollection(null);
                        onSelectMemory(mem);
                      }}
                      className="p-3 rounded-2xl bg-slate-950/60 hover:bg-purple-600/15 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all flex items-center gap-3"
                    >
                      {mem.photos?.[0] && (
                        <img
                          src={mem.photos[0]}
                          alt={mem.title}
                          className="w-14 h-14 rounded-xl object-cover ring-1 ring-purple-500/20 shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1 text-xs">
                        <p className="font-bold text-white truncate">{mem.title}</p>
                        <p className="text-[11px] text-purple-300 truncate">📍 {mem.location.city}</p>
                        <p className="text-[10px] text-slate-400">📅 {mem.date}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-white">Create New Collection</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Collection Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa Memories, Campus Fests"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="What is the story behind this collection?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
