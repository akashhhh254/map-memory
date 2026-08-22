import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Search,
  Filter,
  Plus,
  Compass,
  Layers,
  Sparkles,
  Maximize2,
  Calendar,
  Users,
  ArrowRight,
  Route,
  Navigation,
} from 'lucide-react';
import { LocationData, Memory, MemoryCategory, Person, UserSettings } from '../types';
import { GeocodingService } from '../services/geocodingService';

interface MemoryMapViewProps {
  memories: Memory[];
  people: Person[];
  selectedMemory?: Memory | null;
  onSelectMemory: (memory: Memory) => void;
  onOpenCreate?: () => void;
  onOpenCreateWithLocation?: (loc: LocationData) => void;
  onSelectLocationFromMap?: (loc: LocationData) => void;
  settings: UserSettings;
}

const CATEGORY_COLORS: Record<MemoryCategory, string> = {
  Travel: '#10B981', // Emerald
  College: '#8B5CF6', // Purple
  Work: '#3B82F6', // Blue
  Friends: '#EC4899', // Pink
  Family: '#F59E0B', // Amber
  Events: '#6366F1', // Indigo
  Food: '#F97316', // Orange
  Other: '#64748B', // Slate
};

const CITY_PRESETS = [
  { name: 'World View', center: [20.0, 10.0], zoom: 2 },
  { name: 'Paris', center: [48.8566, 2.3522], zoom: 12 },
  { name: 'Tokyo', center: [35.6762, 139.6503], zoom: 12 },
  { name: 'New York', center: [40.7128, -74.006], zoom: 12 },
  { name: 'London', center: [51.5074, -0.1278], zoom: 12 },
  { name: 'Dubai', center: [25.2048, 55.2708], zoom: 12 },
  { name: 'Sydney', center: [-33.8688, 151.2093], zoom: 12 },
  { name: 'Mumbai', center: [19.0760, 72.8777], zoom: 12 },
];

export const MemoryMapView: React.FC<MemoryMapViewProps> = ({
  memories,
  people,
  selectedMemory: externalSelectedMemory,
  onSelectMemory,
  onOpenCreate,
  onOpenCreateWithLocation,
  onSelectLocationFromMap,
  settings,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineLayerRef = useRef<L.Polyline | null>(null);

  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(externalSelectedMemory || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('World View');
  const [showTrails, setShowTrails] = useState(true);
  const [mapTileStyle, setMapTileStyle] = useState<'dark' | 'light' | 'satellite'>('dark');
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Sync external selectedMemory
  useEffect(() => {
    if (externalSelectedMemory) {
      setSelectedMemory(externalSelectedMemory);
      if (mapInstanceRef.current && externalSelectedMemory.location) {
        mapInstanceRef.current.flyTo(
          [externalSelectedMemory.location.lat, externalSelectedMemory.location.lng],
          14,
          { duration: 1.2 }
        );
      }
    }
  }, [externalSelectedMemory]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile Layer selection
      const getTileUrl = (style: string) => {
        if (style === 'dark') {
          return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        }
        if (style === 'light') {
          return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        }
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      };

      const tileLayer = L.tileLayer(getTileUrl(mapTileStyle), {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      (map as any)._customTileLayer = tileLayer;

      // Layer group for markers
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      // Handle map click to drop custom pin / create memory
      map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setClickedCoords({ lat, lng });
        try {
          const loc = await GeocodingService.reverseGeocode(lat, lng);
          if (typeof onOpenCreateWithLocation === 'function') {
            onOpenCreateWithLocation(loc);
          } else if (typeof onSelectLocationFromMap === 'function') {
            onSelectLocationFromMap(loc);
          } else if (typeof onOpenCreate === 'function') {
            onOpenCreate();
          }
        } catch (err) {
          console.error('Geocoding error on map click:', err);
          const fallbackLoc: LocationData = {
            placeName: 'Selected Location',
            city: 'Unknown City',
            country: 'Earth',
            lat,
            lng,
          };
          if (typeof onOpenCreateWithLocation === 'function') {
            onOpenCreateWithLocation(fallbackLoc);
          } else if (typeof onSelectLocationFromMap === 'function') {
            onSelectLocationFromMap(fallbackLoc);
          } else if (typeof onOpenCreate === 'function') {
            onOpenCreate();
          }
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      // Don't destroy on every rerender
    };
  }, []);

  // Update Tile Style
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if ((map as any)._customTileLayer) {
      map.removeLayer((map as any)._customTileLayer);
    }
    const getTileUrl = (style: string) => {
      if (style === 'dark') {
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      }
      if (style === 'light') {
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      }
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    };

    const tileLayer = L.tileLayer(getTileUrl(mapTileStyle), {
      attribution: '&copy; CARTO &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);
    (map as any)._customTileLayer = tileLayer;
  }, [mapTileStyle]);

  // Render Markers & Memory Trails
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    if (polylineLayerRef.current) {
      map.removeLayer(polylineLayerRef.current);
      polylineLayerRef.current = null;
    }

    // Filter memories
    const filtered = memories.filter((mem) => {
      if (selectedCategory !== 'all' && mem.category !== selectedCategory) {
        return false;
      }
      if (selectedCity !== 'World View' && mem.location.city !== selectedCity) {
        return false;
      }
      return true;
    });

    const latLngs: [number, number][] = [];

    // Chronologically sorted for routes
    const chronological = [...filtered].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    chronological.forEach((mem) => {
      if (mem.location.lat && mem.location.lng) {
        latLngs.push([mem.location.lat, mem.location.lng]);
      }
    });

    // Draw Memory Trail Polyline
    if (showTrails && latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: '#8B5CF6',
        weight: 3,
        opacity: 0.7,
        dashArray: '6, 8',
        lineCap: 'round',
      }).addTo(map);
      polylineLayerRef.current = polyline;
    }

    // Add Markers
    filtered.forEach((mem) => {
      const color = CATEGORY_COLORS[mem.category] || '#8B5CF6';
      const hasPhoto = mem.photos && mem.photos.length > 0;
      const photoUrl = hasPhoto ? mem.photos[0] : '';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background-color: ${color}33; animation: ping-slow 2.4s infinite;"></div>
            <div style="width: 32px; height: 32px; border-radius: 12px; background: #0f172a; border: 2.5px solid ${color}; box-shadow: 0 8px 16px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; overflow: hidden; transform: translateY(-4px); transition: transform 0.2s;">
              ${
                photoUrl
                  ? `<img src="${photoUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${mem.title}"/>`
                  : `<span style="font-size: 14px; font-weight: bold; color: ${color};">📍</span>`
              }
            </div>
            <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; border-radius: 50%; background: ${color}; box-shadow: 0 0 8px ${color};"></div>
          </div>
        `,
        iconSize: [36, 42],
        iconAnchor: [18, 40],
      });

      const marker = L.marker([mem.location.lat, mem.location.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedMemory(mem);
        map.flyTo([mem.location.lat, mem.location.lng], Math.max(map.getZoom(), 12), {
          duration: 1.2,
        });
      });

      markersLayer.addLayer(marker);
    });

    // Auto-fit if filter changed
    if (latLngs.length > 0 && selectedCity !== 'World View') {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [memories, selectedCategory, selectedCity, showTrails]);

  // Handle Search Input
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setIsSearching(true);
      const results = await GeocodingService.searchLocations(val);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectLocationResult = (loc: LocationData) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 14, { duration: 1.5 });
    }
    setSearchQuery(loc.placeName);
    setSearchResults([]);
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    const preset = CITY_PRESETS.find((c) => c.name === cityName);
    if (preset && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(preset.center as [number, number], preset.zoom, {
        duration: 1.5,
      });
    }
  };

  const getPersonNames = (ids: string[]) => {
    return ids
      .map((id) => people.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 flex flex-col">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-col gap-2 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
          {/* Search Location Bar */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-violet-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search any place or city in the world (e.g. Paris, Tokyo, New York, London)..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#11111A]/95 text-slate-100 placeholder-slate-400 text-xs font-medium border border-slate-800 shadow-2xl backdrop-blur-xl focus:outline-none focus:ring-1 focus:ring-violet-500/60 focus:border-violet-500 transition-all"
              />
            </div>

            {/* Search Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 rounded-2xl bg-[#11111A] border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden z-30 max-h-60 overflow-y-auto divide-y divide-slate-850">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectLocationResult(result)}
                    className="w-full text-left p-3 hover:bg-violet-600/10 text-xs transition-colors flex items-start gap-2.5"
                  >
                    <MapPin className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">{result.placeName}</p>
                      <p className="text-[11px] text-slate-400">{result.formattedAddress || `${result.city}, ${result.country}`}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map Tool Actions (Tiles, Trails, Fit All) */}
          <div className="flex items-center gap-2 bg-[#11111A]/95 border border-slate-800 p-1 rounded-2xl shadow-xl backdrop-blur-xl text-xs font-medium">
            <button
              onClick={() => setShowTrails(!showTrails)}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                showTrails
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Chronological Travel Routes"
            >
              <Route className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Memory Trails</span>
            </button>

            <div className="h-4 w-px bg-slate-800" />

            <button
              onClick={() =>
                setMapTileStyle(mapTileStyle === 'dark' ? 'satellite' : mapTileStyle === 'satellite' ? 'light' : 'dark')
              }
              className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              title="Toggle Map Style"
            >
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              <span className="capitalize">{mapTileStyle}</span>
            </button>

            <div className="h-4 w-px bg-slate-800" />

            <button
              onClick={() => handleCitySelect('All Places')}
              className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              title="Fit all places in view"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Fit All</span>
            </button>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pointer-events-auto no-scrollbar">
          {CITY_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleCitySelect(preset.name)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-md ${
                selectedCity === preset.name
                  ? 'bg-violet-600 text-white shadow-violet-600/30 scale-105'
                  : 'bg-[#11111A]/95 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {preset.name}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-800 mx-1 shrink-0" />

          {/* Category Filter Pills */}
          {['all', 'Travel', 'College', 'Friends', 'Work', 'Family', 'Food'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-md ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30 scale-105'
                  : 'bg-[#11111A]/95 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Map Element Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Bottom Floating Hint / Click to Drop Pin */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:block">
        <div className="px-3.5 py-2 rounded-2xl bg-[#11111A]/95 border border-slate-800 text-slate-300 text-xs font-medium shadow-xl backdrop-blur-md flex items-center gap-2">
          <Navigation className="w-4 h-4 text-violet-400 animate-pulse" />
          <span>Click anywhere on the map to add a memory at that exact place.</span>
        </div>
      </div>

      {/* Selected Memory Floating Card (As specified in prompt!) */}
      {selectedMemory && (
        <div className="absolute bottom-6 right-6 z-30 max-w-sm w-full p-4 rounded-3xl bg-[#11111A]/95 border border-violet-500/40 shadow-2xl shadow-black/80 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-200 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: CATEGORY_COLORS[selectedMemory.category] || '#8B5CF6' }}
              >
                {selectedMemory.category}
              </span>
              <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                {selectedMemory.title}
              </h3>
            </div>
            <button
              onClick={() => setSelectedMemory(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1 text-xs text-slate-300">
            <p className="flex items-center gap-1.5 text-violet-300 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedMemory.location.placeName}, {selectedMemory.location.city}</span>
            </p>
            <p className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(selectedMemory.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })}</span>
            </p>
            {selectedMemory.peopleIds.length > 0 && (
              <p className="flex items-center gap-1.5 text-slate-400">
                <Users className="w-3.5 h-3.5" />
                <span>With {getPersonNames(selectedMemory.peopleIds)}</span>
              </p>
            )}
          </div>

          {selectedMemory.photos && selectedMemory.photos.length > 0 && (
            <div className="rounded-xl overflow-hidden h-32 w-full">
              <img
                src={selectedMemory.photos[0]}
                alt={selectedMemory.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <p className="text-xs text-slate-300 italic line-clamp-2 leading-relaxed bg-[#0A0A0F] p-2 rounded-xl border border-slate-800">
            “{selectedMemory.story}”
          </p>

          <button
            onClick={() => onSelectMemory(selectedMemory)}
            className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-1.5 group"
          >
            <span>View Full Memory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};
