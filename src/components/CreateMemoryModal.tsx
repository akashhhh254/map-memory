import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Sparkles,
  Users,
  Image as ImageIcon,
  FolderHeart,
  Tag,
  Calendar,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  Search,
  Plus,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Collection,
  LocationData,
  Memory,
  MemoryCategory,
  Person,
  UserSettings,
} from '../types';
import { GeocodingService, POPULAR_LOCATIONS } from '../services/geocodingService';
import { AIService } from '../services/aiService';

interface CreateMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMemory: (memory: Memory) => void;
  people: Person[];
  collections: Collection[];
  initialLocation?: LocationData | null;
  settings: UserSettings;
}

const CATEGORIES: MemoryCategory[] = [
  'Travel',
  'College',
  'Friends',
  'Work',
  'Family',
  'Food',
  'Events',
  'Other',
];

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
];

export const CreateMemoryModal: React.FC<CreateMemoryModalProps> = ({
  isOpen,
  onClose,
  onSaveMemory,
  people,
  collections,
  initialLocation,
  settings,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [location, setLocation] = useState<LocationData>(
    initialLocation || POPULAR_LOCATIONS[0]
  );
  const [locationQuery, setLocationQuery] = useState(
    initialLocation?.placeName || POPULAR_LOCATIONS[0].placeName
  );
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);

  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<MemoryCategory>('Travel');

  const [selectedPeopleIds, setSelectedPeopleIds] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([PRESET_PHOTOS[0]]);
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  const [tags, setTags] = useState<string[]>(['Milestone', 'Memories']);
  const [tagInput, setTagInput] = useState('');
  const [collectionId, setCollectionId] = useState<string>(collections[0]?.id || '');
  const [eventName, setEventName] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReviewOpen, setAiReviewOpen] = useState(false);

  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
      setLocationQuery(initialLocation.placeName);
    }
  }, [initialLocation]);

  if (!isOpen) return null;

  // Search places
  const handleLocationSearch = async (query: string) => {
    setLocationQuery(query);
    if (query.trim().length >= 2) {
      const results = await GeocodingService.searchLocations(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectLocation = (loc: LocationData) => {
    setLocation(loc);
    setLocationQuery(loc.placeName);
    setSearchResults([]);
  };

  // Toggle Person
  const togglePerson = (id: string) => {
    setSelectedPeopleIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Add Tag
  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  // Photo Upload Handler (Local file to Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setPhotos((prev) => [loadEvt.target!.result as string, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPresetPhoto = (url: string) => {
    if (!photos.includes(url)) {
      setPhotos([...photos, url]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  // AI Auto Organize Action
  const handleAiOrganize = async () => {
    setIsAiLoading(true);
    const suggestion = await AIService.organizeWithAI({
      title,
      story,
      placeName: location.placeName,
      city: location.city,
      date,
      existingPeople: people,
    });

    if (suggestion) {
      if (suggestion.category) setCategory(suggestion.category);
      if (suggestion.tags && suggestion.tags.length) {
        setTags(Array.from(new Set([...tags, ...suggestion.tags])));
      }
      if (suggestion.aiSummary) setAiSummary(suggestion.aiSummary);

      // Auto-match people IDs
      if (suggestion.peopleNames && suggestion.peopleNames.length) {
        const matchedIds = people
          .filter((p) =>
            suggestion.peopleNames.some(
              (n) => p.name.toLowerCase().includes(n.toLowerCase())
            )
          )
          .map((p) => p.id);
        setSelectedPeopleIds(Array.from(new Set([...selectedPeopleIds, ...matchedIds])));
      }

      // Auto-match collection
      if (suggestion.collectionName) {
        const matchedCol = collections.find((c) =>
          c.name.toLowerCase().includes(suggestion.collectionName!.toLowerCase())
        );
        if (matchedCol) setCollectionId(matchedCol.id);
      }

      setAiReviewOpen(true);
    }
    setIsAiLoading(false);
  };

  // AI Generate Summary Only
  const handleGenerateSummary = async () => {
    setIsAiLoading(true);
    const peopleNames = selectedPeopleIds
      .map((id) => people.find((p) => p.id === id)?.name)
      .filter(Boolean) as string[];

    const summary = await AIService.generateSummary({
      title: title || 'Untitled Memory',
      story: story || 'A great time.',
      placeName: location.placeName,
      city: location.city,
      date,
      peopleNames,
      tags,
    });

    setAiSummary(summary);
    setIsAiLoading(false);
  };

  // Final Submit
  const handleFinalSave = () => {
    if (!title.trim()) {
      alert('Please enter a memory title.');
      setStep(2);
      return;
    }

    const newMemory: Memory = {
      id: `mem-${Date.now()}`,
      title: title.trim(),
      story: story.trim() || 'A cherished moment recorded in Memory Map.',
      date,
      location,
      category,
      peopleIds: selectedPeopleIds,
      photos: photos.length > 0 ? photos : [PRESET_PHOTOS[0]],
      tags,
      collectionId: collectionId || undefined,
      eventName: eventName.trim() || undefined,
      aiSummary: aiSummary.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onSaveMemory(newMemory);

    // Trigger celebration confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#10B981', '#6366F1', '#EC4899', '#F59E0B'],
      });
    } catch (e) {
      // Confetti fallback
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">Create New Memory</h2>
              <p className="text-[11px] text-slate-400">Step {step} of 5 — {step === 1 ? 'Location & Place' : step === 2 ? 'The Story' : step === 3 ? 'People' : step === 4 ? 'Photos' : 'Organize with AI'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-5 px-6 pt-3 gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-purple-600' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Modal Body / Multi-Step Wizard */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* STEP 1: PLACE */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-150">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Search Location or Choose from Popular Indian Places
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Search Nagpur, Mumbai, Pune, Goa, Delhi, Hyderabad..."
                    value={locationQuery}
                    onChange={(e) => handleLocationSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 text-white border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Autocomplete dropdown */}
                {searchResults.length > 0 && (
                  <div className="mt-2 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden divide-y divide-slate-850">
                    {searchResults.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectLocation(res)}
                        className="w-full text-left p-2.5 hover:bg-purple-600/20 text-slate-200 text-xs flex items-center gap-2"
                      >
                        <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate font-medium">{res.placeName}, {res.city}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Location Card */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-purple-400">Selected Coordinates</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                </div>
                <p className="text-sm font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{location.placeName}, {location.city}</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  {location.formattedAddress || `${location.city}, ${location.country}`}
                </p>
              </div>

              {/* Quick Preset Places */}
              <div>
                <p className="text-slate-400 font-medium mb-2">Quick presets:</p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_LOCATIONS.slice(0, 6).map((pop, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectLocation(pop)}
                      className={`px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold ${
                        location.city === pop.city && location.placeName === pop.placeName
                          ? 'bg-purple-600 text-white border-purple-500'
                          : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {pop.placeName.split('&')[0]} ({pop.city})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MEMORY DETAILS */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-150">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Memory Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. First College Hackathon Triumph, Marine Drive Sunset"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 text-white border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 text-white border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 text-white border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">The Story & Moments</label>
                  <button
                    type="button"
                    onClick={handleGenerateSummary}
                    disabled={isAiLoading || !story}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate AI Emotional Summary</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Describe what happened, the atmosphere, late-night conversations, feelings, and why this place matters to you..."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 text-white border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
                />
              </div>

              {aiSummary && (
                <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-purple-200 italic space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 not-italic flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Emotional Summary
                  </span>
                  <p>“{aiSummary}”</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PEOPLE */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-150">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tag People Who Were With You
                </label>
                <p className="text-[11px] text-slate-400 mb-3">
                  Tagged companions will be interconnected in the personal relationship graph.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto">
                {people.map((person) => {
                  const isSelected = selectedPeopleIds.includes(person.id);
                  return (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => togglePerson(person.id)}
                      className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 text-left ${
                        isSelected
                          ? 'bg-purple-600/20 border-purple-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-purple-500/40 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs text-white truncate">{person.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{person.relation}</p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: PHOTOS */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-150">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Upload Photos or Pick Aesthetic Presets
                </label>
                <p className="text-[11px] text-slate-400">
                  Attach photos to preserve visual memories in high resolution.
                </p>
              </div>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-slate-700 hover:border-purple-500/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-950/40 hover:bg-purple-600/5 transition-all">
                <Upload className="w-6 h-6 text-purple-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Click to select photos from device
                </span>
                <span className="text-[10px] text-slate-400">JPG, PNG, WebP supported</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Selected Photos Grid */}
              {photos.length > 0 && (
                <div>
                  <p className="text-slate-300 font-semibold mb-2">Selected Images ({photos.length})</p>
                  <div className="grid grid-cols-4 gap-2">
                    {photos.map((p, idx) => (
                      <div key={idx} className="relative h-20 rounded-xl overflow-hidden group">
                        <img src={p} alt="Memory" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preset Travel Photos */}
              <div>
                <p className="text-slate-400 font-medium mb-1.5">Preset photography:</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {PRESET_PHOTOS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPresetPhoto(url)}
                      className="h-12 rounded-lg overflow-hidden border border-slate-800 hover:border-purple-500 transition-all hover:scale-105"
                    >
                      <img src={url} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: ORGANIZE & AI SYNTHESIS */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-150">
              {/* AI Auto Organize Button */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border border-purple-500/40 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Organize with AI Intelligence</span>
                  </div>
                  <p className="text-[10px] text-purple-300 mt-0.5">
                    Automatically infers category, tags, emotional summary, and companions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAiOrganize}
                  disabled={isAiLoading}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                >
                  {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Organize with AI</span>
                </button>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 text-white border border-slate-700 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 text-xs font-medium flex items-center gap-1"
                    >
                      #{t}
                      <button type="button" onClick={() => removeTag(t)}>
                        <X className="w-3 h-3 text-slate-400 hover:text-white" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Collection & Event */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Collection</label>
                  <select
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-slate-700 text-xs"
                  >
                    <option value="">No Collection</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Connected Event</label>
                  <input
                    type="text"
                    placeholder="e.g. InnovateNagpur 2026"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer / Step Navigation */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSave}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Memory</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
