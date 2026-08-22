import { Collection, Memory, Person, UserSettings } from '../types';
import {
  initialCollections,
  initialMemories,
  initialPeople,
  initialUserSettings,
} from '../data/demoData';

const STORAGE_KEYS = {
  MEMORIES: 'memorymap_memories_v1',
  PEOPLE: 'memorymap_people_v1',
  COLLECTIONS: 'memorymap_collections_v1',
  SETTINGS: 'memorymap_settings_v1',
};

export class StorageService {
  static getMemories(): Memory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      if (!data) {
        this.saveMemories(initialMemories);
        return initialMemories;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load memories from localStorage', e);
      return initialMemories;
    }
  }

  static saveMemories(memories: Memory[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
    } catch (e) {
      console.error('Failed to save memories to localStorage', e);
    }
  }

  static getPeople(): Person[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PEOPLE);
      if (!data) {
        this.savePeople(initialPeople);
        return initialPeople;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load people from localStorage', e);
      return initialPeople;
    }
  }

  static savePeople(people: Person[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(people));
    } catch (e) {
      console.error('Failed to save people to localStorage', e);
    }
  }

  static getCollections(): Collection[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      if (!data) {
        this.saveCollections(initialCollections);
        return initialCollections;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load collections from localStorage', e);
      return initialCollections;
    }
  }

  static saveCollections(collections: Collection[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
    } catch (e) {
      console.error('Failed to save collections to localStorage', e);
    }
  }

  static getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        this.saveSettings(initialUserSettings);
        return initialUserSettings;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
      return initialUserSettings;
    }
  }

  static saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }

  static resetToDemoData(): {
    memories: Memory[];
    people: Person[];
    collections: Collection[];
    settings: UserSettings;
  } {
    this.saveMemories(initialMemories);
    this.savePeople(initialPeople);
    this.saveCollections(initialCollections);
    this.saveSettings(initialUserSettings);
    return {
      memories: initialMemories,
      people: initialPeople,
      collections: initialCollections,
      settings: initialUserSettings,
    };
  }

  static resetDemoData() {
    return this.resetToDemoData();
  }

  static saveMemory(memory: Memory): Memory[] {
    const memories = this.getMemories();
    const index = memories.findIndex((m) => m.id === memory.id);
    let updated: Memory[];
    if (index >= 0) {
      updated = [...memories];
      updated[index] = memory;
    } else {
      updated = [memory, ...memories];
    }
    this.saveMemories(updated);
    return updated;
  }

  static deleteMemory(id: string): Memory[] {
    const memories = this.getMemories();
    const updated = memories.filter((m) => m.id !== id);
    this.saveMemories(updated);
    return updated;
  }

  static savePerson(person: Person): Person[] {
    const people = this.getPeople();
    const index = people.findIndex((p) => p.id === person.id);
    let updated: Person[];
    if (index >= 0) {
      updated = [...people];
      updated[index] = person;
    } else {
      updated = [...people, person];
    }
    this.savePeople(updated);
    return updated;
  }

  static saveCollection(collection: Collection): Collection[] {
    const collections = this.getCollections();
    const index = collections.findIndex((c) => c.id === collection.id);
    let updated: Collection[];
    if (index >= 0) {
      updated = [...collections];
      updated[index] = collection;
    } else {
      updated = [...collections, collection];
    }
    this.saveCollections(updated);
    return updated;
  }

  static deleteCollection(id: string): Collection[] {
    const collections = this.getCollections();
    const updated = collections.filter((c) => c.id !== id);
    this.saveCollections(updated);
    return updated;
  }

  static exportDataJSON(): string {
    const payload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'Memory Map',
      data: {
        memories: this.getMemories(),
        people: this.getPeople(),
        collections: this.getCollections(),
        settings: this.getSettings(),
      },
    };
    return JSON.stringify(payload, null, 2);
  }

  static importDataJSON(jsonStr: string): {
    memories: Memory[];
    people: Person[];
    collections: Collection[];
    settings: UserSettings;
  } {
    const parsed = JSON.parse(jsonStr);
    const data = parsed.data || parsed;

    const memories: Memory[] = Array.isArray(data.memories) ? data.memories : initialMemories;
    const people: Person[] = Array.isArray(data.people) ? data.people : initialPeople;
    const collections: Collection[] = Array.isArray(data.collections)
      ? data.collections
      : initialCollections;
    const settings: UserSettings = data.settings || initialUserSettings;

    this.saveMemories(memories);
    this.savePeople(people);
    this.saveCollections(collections);
    this.saveSettings(settings);

    return { memories, people, collections, settings };
  }
}
