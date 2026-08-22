import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Collection, Memory, Person, UserSettings } from '../types';
import {
  initialCollections,
  initialMemories,
  initialPeople,
  initialUserSettings,
} from '../data/demoData';

const LOCAL_STORAGE_KEYS = {
  MEMORIES: 'memorymap_memories_v1',
  PEOPLE: 'memorymap_people_v1',
  COLLECTIONS: 'memorymap_collections_v1',
  SETTINGS: 'memorymap_settings_v1',
};

export class StorageService {
  // Local fallback reads
  static getMemoriesLocal(): Memory[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.MEMORIES);
      return data ? JSON.parse(data) : initialMemories;
    } catch {
      return initialMemories;
    }
  }

  static getPeopleLocal(): Person[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.PEOPLE);
      return data ? JSON.parse(data) : initialPeople;
    } catch {
      return initialPeople;
    }
  }

  static getCollectionsLocal(): Collection[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.COLLECTIONS);
      return data ? JSON.parse(data) : initialCollections;
    } catch {
      return initialCollections;
    }
  }

  static getSettingsLocal(): UserSettings {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : initialUserSettings;
    } catch {
      return initialUserSettings;
    }
  }

  // Local cache writes
  static saveMemoriesLocal(memories: Memory[]) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
    } catch (e) {
      console.warn('Local storage cache error', e);
    }
  }

  static savePeopleLocal(people: Person[]) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PEOPLE, JSON.stringify(people));
    } catch (e) {
      console.warn('Local storage cache error', e);
    }
  }

  static saveCollectionsLocal(collections: Collection[]) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
    } catch (e) {
      console.warn('Local storage cache error', e);
    }
  }

  static saveSettingsLocal(settings: UserSettings) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Local storage cache error', e);
    }
  }

  // Synchronous getters used by sync initializations
  static getMemories(): Memory[] {
    return this.getMemoriesLocal();
  }

  static getPeople(): Person[] {
    return this.getPeopleLocal();
  }

  static getCollections(): Collection[] {
    return this.getCollectionsLocal();
  }

  static getSettings(): UserSettings {
    return this.getSettingsLocal();
  }

  // Firestore Realtime Subscription Listeners
  static subscribeMemories(callback: (memories: Memory[]) => void): Unsubscribe {
    const memRef = collection(db, 'memories');
    return onSnapshot(
      memRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const memories = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Memory, 'id'>),
          }));
          this.saveMemoriesLocal(memories);
          callback(memories);
        } else {
          // If Firestore is empty, seed initial worldwide memories
          this.seedInitialDatabase();
          const local = this.getMemoriesLocal();
          callback(local);
        }
      },
      (error) => {
        console.warn('Firestore memories subscription error, using local data:', error);
        callback(this.getMemoriesLocal());
      }
    );
  }

  static subscribePeople(callback: (people: Person[]) => void): Unsubscribe {
    const peopleRef = collection(db, 'people');
    return onSnapshot(
      peopleRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const people = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Person, 'id'>),
          }));
          this.savePeopleLocal(people);
          callback(people);
        } else {
          const local = this.getPeopleLocal();
          callback(local);
        }
      },
      (error) => {
        console.warn('Firestore people subscription error:', error);
        callback(this.getPeopleLocal());
      }
    );
  }

  static subscribeCollections(callback: (collections: Collection[]) => void): Unsubscribe {
    const colRef = collection(db, 'collections');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const collections = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Collection, 'id'>),
          }));
          this.saveCollectionsLocal(collections);
          callback(collections);
        } else {
          const local = this.getCollectionsLocal();
          callback(local);
        }
      },
      (error) => {
        console.warn('Firestore collections subscription error:', error);
        callback(this.getCollectionsLocal());
      }
    );
  }

  static async seedInitialDatabase(): Promise<void> {
    try {
      // Check if already seeded
      const snap = await getDocs(collection(db, 'memories'));
      if (snap.empty) {
        for (const mem of initialMemories) {
          const { id, ...data } = mem;
          await setDoc(doc(db, 'memories', id), data);
        }
        for (const person of initialPeople) {
          const { id, ...data } = person;
          await setDoc(doc(db, 'people', id), data);
        }
        for (const col of initialCollections) {
          const { id, ...data } = col;
          await setDoc(doc(db, 'collections', id), data);
        }
      }
    } catch (e) {
      console.warn('Firestore initial seeding note:', e);
    }
  }

  // Write operations with Cloud Firestore + Local Cache
  static async saveMemory(memory: Memory): Promise<Memory[]> {
    const localMemories = this.getMemoriesLocal();
    const index = localMemories.findIndex((m) => m.id === memory.id);
    let updated: Memory[];
    if (index >= 0) {
      updated = [...localMemories];
      updated[index] = memory;
    } else {
      updated = [memory, ...localMemories];
    }
    this.saveMemoriesLocal(updated);

    try {
      const { id, ...data } = memory;
      await setDoc(doc(db, 'memories', id), data);
    } catch (e) {
      console.warn('Cloud sync for saveMemory note:', e);
    }

    return updated;
  }

  static async deleteMemory(id: string): Promise<Memory[]> {
    const localMemories = this.getMemoriesLocal();
    const updated = localMemories.filter((m) => m.id !== id);
    this.saveMemoriesLocal(updated);

    try {
      await deleteDoc(doc(db, 'memories', id));
    } catch (e) {
      console.warn('Cloud sync for deleteMemory note:', e);
    }

    return updated;
  }

  static async savePerson(person: Person): Promise<Person[]> {
    const localPeople = this.getPeopleLocal();
    const index = localPeople.findIndex((p) => p.id === person.id);
    let updated: Person[];
    if (index >= 0) {
      updated = [...localPeople];
      updated[index] = person;
    } else {
      updated = [...localPeople, person];
    }
    this.savePeopleLocal(updated);

    try {
      const { id, ...data } = person;
      await setDoc(doc(db, 'people', id), data);
    } catch (e) {
      console.warn('Cloud sync for savePerson note:', e);
    }

    return updated;
  }

  static async saveCollection(col: Collection): Promise<Collection[]> {
    const localCols = this.getCollectionsLocal();
    const index = localCols.findIndex((c) => c.id === col.id);
    let updated: Collection[];
    if (index >= 0) {
      updated = [...localCols];
      updated[index] = col;
    } else {
      updated = [...localCols, col];
    }
    this.saveCollectionsLocal(updated);

    try {
      const { id, ...data } = col;
      await setDoc(doc(db, 'collections', id), data);
    } catch (e) {
      console.warn('Cloud sync for saveCollection note:', e);
    }

    return updated;
  }

  static async deleteCollection(id: string): Promise<Collection[]> {
    const localCols = this.getCollectionsLocal();
    const updated = localCols.filter((c) => c.id !== id);
    this.saveCollectionsLocal(updated);

    try {
      await deleteDoc(doc(db, 'collections', id));
    } catch (e) {
      console.warn('Cloud sync for deleteCollection note:', e);
    }

    return updated;
  }

  static saveSettings(settings: UserSettings): void {
    this.saveSettingsLocal(settings);
    try {
      setDoc(doc(db, 'settings', 'user_profile'), settings);
    } catch (e) {
      console.warn('Cloud sync for settings note:', e);
    }
  }

  static async resetToDemoData(): Promise<{
    memories: Memory[];
    people: Person[];
    collections: Collection[];
    settings: UserSettings;
  }> {
    this.saveMemoriesLocal(initialMemories);
    this.savePeopleLocal(initialPeople);
    this.saveCollectionsLocal(initialCollections);
    this.saveSettingsLocal(initialUserSettings);

    try {
      for (const mem of initialMemories) {
        const { id, ...data } = mem;
        await setDoc(doc(db, 'memories', id), data);
      }
      for (const person of initialPeople) {
        const { id, ...data } = person;
        await setDoc(doc(db, 'people', id), data);
      }
      for (const col of initialCollections) {
        const { id, ...data } = col;
        await setDoc(doc(db, 'collections', id), data);
      }
    } catch (e) {
      console.warn('Cloud reset note:', e);
    }

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

  static exportDataJSON(): string {
    const payload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'Memory Map',
      data: {
        memories: this.getMemoriesLocal(),
        people: this.getPeopleLocal(),
        collections: this.getCollectionsLocal(),
        settings: this.getSettingsLocal(),
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

    this.saveMemoriesLocal(memories);
    this.savePeopleLocal(people);
    this.saveCollectionsLocal(collections);
    this.saveSettingsLocal(settings);

    // Sync to cloud
    for (const mem of memories) {
      const { id, ...d } = mem;
      setDoc(doc(db, 'memories', id), d).catch(console.warn);
    }

    return { memories, people, collections, settings };
  }
}
