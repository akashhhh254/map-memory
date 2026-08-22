import React, { useState, useEffect, useCallback } from 'react';
import { AppView, AuthUser, Collection, LocationData, Memory, Person, UserSettings } from './types';
import { StorageService } from './services/storageService';
import { AuthService } from './services/authService';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { MemoryMapView } from './components/MemoryMapView';
import { MemoryGraphView } from './components/MemoryGraphView';
import { TimelineView } from './components/TimelineView';
import { PeopleView } from './components/PeopleView';
import { CollectionsView } from './components/CollectionsView';
import { GalleryView } from './components/GalleryView';
import { InsightsView } from './components/InsightsView';
import { MemoriesListView } from './components/MemoriesListView';
import { SettingsView } from './components/SettingsView';
import { CreateMemoryModal } from './components/CreateMemoryModal';
import { MemoryDetailModal } from './components/MemoryDetailModal';
import { ShareModal } from './components/ShareModal';
import { DemoTourModal } from './components/DemoTourModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Authentication State
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Core Data State
  const [memories, setMemories] = useState<Memory[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());

  // Modals & Active selections
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialLocation, setCreateInitialLocation] = useState<LocationData | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [shareMemory, setShareMemory] = useState<Memory | null>(null);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    type: 'success' | 'info' | 'warning' | 'error',
    title: string,
    message: string
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth state listener
  useEffect(() => {
    const unsubAuth = AuthService.subscribeToAuth((user) => {
      setAuthUser(user);
      if (user && user.displayName) {
        setSettings((prev) => ({
          ...prev,
          userName: user.displayName || prev.userName,
          userAvatar: user.photoURL || prev.userAvatar,
        }));
      }
    });
    return () => unsubAuth();
  }, []);

  // Initial Data Load & Realtime Firestore Database Subscriptions
  useEffect(() => {
    // Initial local read
    setMemories(StorageService.getMemories());
    setPeople(StorageService.getPeople());
    setCollections(StorageService.getCollections());
    setSettings(StorageService.getSettings());

    // Subscribe to Firestore realtime collections
    const unsubMemories = StorageService.subscribeMemories((m) => {
      setMemories(m);
    });
    const unsubPeople = StorageService.subscribePeople((p) => {
      setPeople(p);
    });
    const unsubCollections = StorageService.subscribeCollections((c) => {
      setCollections(c);
    });

    return () => {
      unsubMemories();
      unsubPeople();
      unsubCollections();
    };
  }, []);

  const handleSignOut = async () => {
    await AuthService.signOutUser();
    addToast('info', 'Signed Out', 'You have been signed out of your account.');
  };

  const handleAuthSuccess = (user: AuthUser) => {
    setAuthUser(user);
    addToast(
      'success',
      'Welcome Back!',
      `Logged in as ${user.displayName || user.email || 'Explorer'}. Database synced.`
    );
  };

  // Save new Memory
  const handleSaveMemory = async (newMemory: Memory) => {
    const updated = await StorageService.saveMemory(newMemory);
    setMemories(updated);
    addToast(
      'success',
      'Memory Saved to Cloud',
      `“${newMemory.title}” saved and pinned to ${newMemory.location.city}.`
    );
  };

  // Delete Memory
  const handleDeleteMemory = async (id: string) => {
    const updated = await StorageService.deleteMemory(id);
    setMemories(updated);
    if (selectedMemory?.id === id) {
      setSelectedMemory(null);
    }
    addToast('info', 'Memory Removed', 'The memory was removed from your map.');
  };

  // Add Person
  const handleAddPerson = async (newPerson: Person) => {
    const updated = await StorageService.savePerson(newPerson);
    setPeople(updated);
    addToast('success', 'Companion Added', `${newPerson.name} added to your network.`);
  };

  // Add Collection
  const handleAddCollection = async (newCol: Collection) => {
    const updated = await StorageService.saveCollection(newCol);
    setCollections(updated);
    addToast('success', 'Collection Created', `“${newCol.name}” created.`);
  };

  // Delete Collection
  const handleDeleteCollection = async (id: string) => {
    const updated = await StorageService.deleteCollection(id);
    setCollections(updated);
    addToast('info', 'Collection Deleted', 'The collection was removed.');
  };

  // Reset to Sample Data
  const handleResetDemo = async () => {
    const { memories: m, people: p, collections: c } = await StorageService.resetToDemoData();
    setMemories(m);
    setPeople(p);
    setCollections(c);
    addToast(
      'success',
      'Sample Data Synced',
      'Loaded connected worldwide memories across Paris, Tokyo, New York, London, Dubai & Mumbai.'
    );
  };

  // Center on Map
  const handleCenterOnMap = (memory: Memory) => {
    setSelectedMemory(memory);
    setCurrentView('map');
  };

  // Quick Map Click to Create
  const handleMapLocationSelect = (loc: LocationData) => {
    setCreateInitialLocation(loc);
    setIsCreateModalOpen(true);
  };

  // Theme Toggle
  const handleToggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const updatedSettings = { ...settings, theme: newTheme as 'dark' | 'light' };
    setSettings(updatedSettings);
    StorageService.saveSettings(updatedSettings);
    addToast(
      'info',
      'Theme Updated',
      `Switched to ${newTheme} mode.`
    );
  };

  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If user is on landing page, display the SaaS landing page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-slate-100 selection:bg-violet-500 selection:text-white font-sans antialiased">
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
        <LandingPage
          onNavigate={setCurrentView}
          onOpenCreate={() => {
            setCreateInitialLocation(null);
            setIsCreateModalOpen(true);
          }}
          onOpenJudgeTour={() => setIsDemoTourOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          memories={memories}
          settings={settings}
          authUser={authUser}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
        <DemoTourModal
          isOpen={isDemoTourOpen}
          onClose={() => setIsDemoTourOpen(false)}
          onNavigate={setCurrentView}
          onResetData={handleResetDemo}
        />
      </div>
    );
  }

  const uniqueCitiesCount = new Set(memories.map((m) => m.location.city)).size;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-100 selection:bg-violet-500 selection:text-white font-sans antialiased flex flex-col h-screen overflow-hidden">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Global Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenCreate={() => {
          setCreateInitialLocation(null);
          setIsCreateModalOpen(true);
        }}
        onOpenSearch={() => {
          setCurrentView('memories');
        }}
        onOpenJudgeTour={() => setIsDemoTourOpen(true)}
        settings={settings}
        onToggleTheme={handleToggleTheme}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        memoryCount={memories.length}
        authUser={authUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* App Main Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sleek Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          memoryCount={memories.length}
          peopleCount={people.length}
          placesCount={uniqueCitiesCount}
          settings={settings}
          authUser={authUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onSignOut={handleSignOut}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-y-auto bg-[#0A0A0F] relative">
          {currentView === 'overview' && (
            <DashboardOverview
              memories={memories}
              people={people}
              onNavigate={setCurrentView}
              onSelectMemory={setSelectedMemory}
              onOpenCreate={() => {
                setCreateInitialLocation(null);
                setIsCreateModalOpen(true);
              }}
              settings={settings}
            />
          )}

          {currentView === 'map' && (
            <MemoryMapView
              memories={memories}
              people={people}
              selectedMemory={selectedMemory}
              onSelectMemory={setSelectedMemory}
              onOpenCreate={() => {
                setCreateInitialLocation(null);
                setIsCreateModalOpen(true);
              }}
              onOpenCreateWithLocation={handleMapLocationSelect}
              onSelectLocationFromMap={handleMapLocationSelect}
              settings={settings}
            />
          )}

          {currentView === 'graph' && (
            <MemoryGraphView
              memories={memories}
              people={people}
              onSelectMemory={setSelectedMemory}
              settings={settings}
            />
          )}

          {currentView === 'timeline' && (
            <TimelineView
              memories={memories}
              people={people}
              onSelectMemory={setSelectedMemory}
              settings={settings}
            />
          )}

          {currentView === 'memories' && (
            <MemoriesListView
              memories={memories}
              people={people}
              collections={collections}
              onSelectMemory={setSelectedMemory}
              onOpenCreate={() => {
                setCreateInitialLocation(null);
                setIsCreateModalOpen(true);
              }}
              onOpenShare={setShareMemory}
              onCenterOnMap={handleCenterOnMap}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              settings={settings}
            />
          )}

          {currentView === 'people' && (
            <PeopleView
              people={people}
              memories={memories}
              onSelectMemory={setSelectedMemory}
              onAddPerson={handleAddPerson}
              settings={settings}
            />
          )}

          {currentView === 'collections' && (
            <CollectionsView
              collections={collections}
              memories={memories}
              onSelectMemory={setSelectedMemory}
              onAddCollection={handleAddCollection}
              onDeleteCollection={handleDeleteCollection}
              settings={settings}
            />
          )}

          {currentView === 'gallery' && (
            <GalleryView
              memories={memories}
              people={people}
              onSelectMemory={setSelectedMemory}
              settings={settings}
            />
          )}

          {currentView === 'insights' && (
            <InsightsView
              memories={memories}
              people={people}
              settings={settings}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(newSettings) => setSettings(newSettings)}
              authUser={authUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onSignOut={handleSignOut}
              onResetData={handleResetDemo}
            />
          )}
        </main>
      </div>

      {/* Sleek Status Footer Bar */}
      <footer className="h-12 bg-[#0A0A0F] border-t border-slate-800 flex items-center px-4 sm:px-6 lg:px-8 justify-between shrink-0 z-30">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">DATABASE CONNECTED</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest hidden sm:inline">
            Global Hub • Worldwide Memory Intelligence
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-slate-600 hidden xs:inline">v2.4.0-stable</span>
          <span className="text-[10px] text-violet-400 font-bold tracking-wider">⚡ POWERED BY MEMORY AI</span>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Create Memory Modal */}
      {isCreateModalOpen && (
        <CreateMemoryModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateInitialLocation(null);
          }}
          onSaveMemory={handleSaveMemory}
          people={people}
          collections={collections}
          initialLocation={createInitialLocation}
          settings={settings}
        />
      )}

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <MemoryDetailModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          people={people}
          onDeleteMemory={handleDeleteMemory}
          onCenterOnMap={handleCenterOnMap}
          onOpenShare={setShareMemory}
          settings={settings}
        />
      )}

      {/* Share Modal */}
      {shareMemory && (
        <ShareModal
          memory={shareMemory}
          people={people}
          onClose={() => setShareMemory(null)}
          settings={settings}
        />
      )}

      {/* Judge Demo Tour Modal */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigate={setCurrentView}
        onResetData={handleResetDemo}
      />
    </div>
  );
}
