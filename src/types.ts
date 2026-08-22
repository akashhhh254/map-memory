export type MemoryCategory =
  | 'Travel'
  | 'Family'
  | 'Friends'
  | 'College'
  | 'Work'
  | 'Events'
  | 'Food'
  | 'Other';

export interface LocationData {
  placeName: string;
  city: string;
  state?: string;
  country: string;
  lat: number;
  lng: number;
  formattedAddress?: string;
}

export interface Person {
  id: string;
  name: string;
  avatar: string;
  relation?: string;
  bio?: string;
  memoryCount?: number;
  placesTogether?: number;
  lastMemoryDate?: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

export interface Memory {
  id: string;
  title: string;
  story: string;
  date: string; // ISO format YYYY-MM-DD
  location: LocationData;
  category: MemoryCategory;
  peopleIds: string[];
  photos: string[];
  tags: string[];
  collectionId?: string;
  eventName?: string;
  aiSummary?: string;
  mood?: string;
  userId?: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  color?: string;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCategories: MemoryCategory[];
  selectedPeopleIds: string[];
  selectedYears: string[];
  selectedCity?: string;
  selectedCountry?: string;
  selectedCollectionId?: string;
  sortOrder: 'newest' | 'oldest';
}

export type GraphNodeType = 'person' | 'memory' | 'place' | 'event' | 'date';

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  subLabel?: string;
  color?: string;
  radius: number;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  originalId?: string;
  category?: string;
  photo?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  label?: string;
  relationship: string;
}

export interface UserSettings {
  userName: string;
  userTitle: string;
  userBio: string;
  userAvatar: string;
  theme: 'dark' | 'light';
  mapStyle: 'dark' | 'light' | 'satellite' | 'streets';
}

export interface AIDraftSuggestion {
  category: MemoryCategory;
  tags: string[];
  peopleNames: string[];
  collectionName?: string;
  aiSummary: string;
  mood: string;
  suggestedTitle?: string;
}

export type AppView =
  | 'landing'
  | 'overview'
  | 'map'
  | 'timeline'
  | 'memories'
  | 'people'
  | 'collections'
  | 'gallery'
  | 'graph'
  | 'insights'
  | 'settings';
