import React, { useState } from 'react';
import {
  Users,
  MapPin,
  Sparkles,
  Calendar,
  Plus,
  ArrowRight,
  UserCheck,
  X,
  Camera,
} from 'lucide-react';
import { Memory, Person, UserSettings } from '../types';

interface PeopleViewProps {
  people: Person[];
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onAddPerson: (person: Person) => void;
  settings: UserSettings;
}

export const PeopleView: React.FC<PeopleViewProps> = ({
  people,
  memories,
  onSelectMemory,
  onAddPerson,
  settings,
}) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newAvatar, setNewAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  );

  // Compute stats for each person
  const peopleWithStats = people.map((person) => {
    const connectedMemories = memories.filter((m) => m.peopleIds.includes(person.id));
    const uniquePlaces = new Set(connectedMemories.map((m) => m.location.city));

    // Sort by date to get last memory
    const sorted = [...connectedMemories].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const lastMemory = sorted[0];

    return {
      ...person,
      memoryCount: connectedMemories.length,
      placesTogether: uniquePlaces.size,
      lastMemoryDate: lastMemory ? lastMemory.date : 'None yet',
      lastMemoryTitle: lastMemory ? lastMemory.title : 'None yet',
      connectedMemories,
    };
  });

  const handleCreatePerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const person: Person = {
      id: `p-${Date.now()}`,
      name: newName.trim(),
      relation: newRelation.trim() || 'Friend',
      bio: newBio.trim() || 'Companion on life adventures.',
      avatar: newAvatar,
    };

    onAddPerson(person);
    setNewName('');
    setNewRelation('');
    setNewBio('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              People & Companions
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {people.length} Friends
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            The people who shared the journeys, milestones, and late-night conversations with you.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Person</span>
        </button>
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {peopleWithStats.map((person) => (
          <div
            key={person.id}
            onClick={() => setSelectedPerson(person)}
            className="group cursor-pointer p-5 rounded-3xl bg-[#11111A] border border-slate-800 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-950/30 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start gap-3.5">
              <img
                src={person.avatar}
                alt={person.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-500/30 group-hover:ring-violet-400 transition-all shadow-md shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                  {person.name}
                </h3>
                <p className="text-[11px] text-violet-400 font-medium truncate mt-0.5">
                  {person.relation || 'Friend'}
                </p>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                  {person.bio}
                </p>
              </div>
            </div>

            {/* Stats Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <div className="p-2 rounded-xl bg-[#0A0A0F] text-center border border-slate-800/80">
                <p className="text-sm font-bold text-white">{person.memoryCount}</p>
                <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">Memories</p>
              </div>
              <div className="p-2 rounded-xl bg-[#0A0A0F] text-center border border-slate-800/80">
                <p className="text-sm font-bold text-emerald-400">{person.placesTogether}</p>
                <p className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">Places</p>
              </div>
            </div>

            {/* Last Memory Snippet */}
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span className="truncate">Last: <strong className="text-slate-300">{person.lastMemoryTitle}</strong></span>
              <ArrowRight className="w-3.5 h-3.5 text-violet-400 group-hover:translate-x-1 transition-transform shrink-0 ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Person Detail Modal (Shows all connected memories) */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 overflow-y-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedPerson.avatar}
                  alt={selectedPerson.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500"
                />
                <div>
                  <h2 className="text-xl font-bold font-display text-white">{selectedPerson.name}</h2>
                  <p className="text-xs text-purple-300 font-medium">{selectedPerson.relation}</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-md">{selectedPerson.bio}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPerson(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Connected Memories List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Shared Memories ({peopleWithStats.find((p) => p.id === selectedPerson.id)?.connectedMemories.length})
                </h3>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {peopleWithStats
                  .find((p) => p.id === selectedPerson.id)
                  ?.connectedMemories.map((mem) => (
                    <div
                      key={mem.id}
                      onClick={() => {
                        setSelectedPerson(null);
                        onSelectMemory(mem);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-purple-600/15 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all flex items-center gap-3"
                    >
                      {mem.photos?.[0] && (
                        <img
                          src={mem.photos[0]}
                          alt={mem.title}
                          className="w-16 h-16 rounded-xl object-cover ring-1 ring-purple-500/20 shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate">{mem.title}</h4>
                        <p className="text-[11px] text-purple-300 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {mem.location.placeName}, {mem.location.city}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> {mem.date} • Category: {mem.category}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Person Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-display text-white">Add New Person</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePerson} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Relationship / Tag</label>
                <input
                  type="text"
                  placeholder="e.g. College Friend, Teammate, Sister"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Short Bio</label>
                <input
                  type="text"
                  placeholder="e.g. Fellow roadtrip explorer and night coder."
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={newAvatar}
                  onChange={(e) => setNewAvatar(e.target.value)}
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
                  Save Person
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
