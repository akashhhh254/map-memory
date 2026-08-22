import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  GitFork,
  CheckCircle2,
  Calendar,
  Play,
  Bookmark,
  Globe2,
} from 'lucide-react';
import { AppView, AuthUser, Memory, UserSettings } from '../types';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
  onOpenCreate: () => void;
  onOpenJudgeTour: () => void;
  onOpenAuth: () => void;
  memories: Memory[];
  settings: UserSettings;
  authUser: AuthUser | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenCreate,
  onOpenJudgeTour,
  onOpenAuth,
  memories,
  authUser,
}) => {
  return (
    <div className="min-h-screen bg-[#0C0D12] text-stone-200">
      {/* Landing Sub-Nav */}
      <div className="border-b border-white/[0.06] bg-[#0C0D12]/90 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs font-medium text-stone-400">
            <a href="#manifesto" className="hover:text-stone-100 transition-colors">Manifesto</a>
            <a href="#features" className="hover:text-stone-100 transition-colors">Architecture</a>
            <a href="#how-it-works" className="hover:text-stone-100 transition-colors">Workflow</a>
            <a href="#innovation" className="hover:text-stone-100 transition-colors">Why Memory Map</a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenJudgeTour}
              className="text-xs font-medium text-stone-300 bg-stone-900 hover:bg-stone-800 px-3 py-1 rounded border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Product Tour</span>
            </button>
            {authUser ? (
              <button
                onClick={() => onNavigate('overview')}
                className="text-xs font-semibold text-stone-950 bg-amber-500 hover:bg-amber-400 px-3 py-1 rounded shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-xs font-medium text-stone-200 bg-stone-900 hover:bg-stone-800 border border-white/[0.08] px-3 py-1 rounded shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* HERO SECTION - Refined Editorial Cartography */}
      <section id="manifesto" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Editorial Copy */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-stone-900 border border-white/[0.08] text-stone-300 text-[11px] font-mono">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>An Interconnected Atlas for Your Life Stories</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight leading-[1.12] text-stone-100">
                Every Place Has a <span className="italic text-amber-400/90 font-serif">Story.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed max-w-xl font-sans">
                Transform the places you have explored into a living, interconnected archive of moments, companions, and geographical footprints. Connect places, photos, dates, friends, and narratives into one searchable memory graph.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onOpenCreate}
                  className="px-5 py-2.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Archive First Memory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigate('map')}
                  className="px-5 py-2.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-200 font-medium text-xs border border-white/[0.08] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Explore Interactive Map</span>
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs font-mono text-stone-400 border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Leaflet Cartography</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>D3.js Relationship Graph</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cloud Persistence</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Hero Preview Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-lg p-2.5 bg-[#141620] border border-white/[0.08] shadow-xl">
                {/* Window Frame */}
                <div className="bg-[#090A0E] rounded overflow-hidden border border-white/[0.06] relative">
                  {/* Top Bar */}
                  <div className="px-3.5 py-2 bg-[#12141C] border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                      <span className="text-[10px] font-mono text-stone-400 ml-2 font-medium">memorymap.app/atlas</span>
                    </div>
                    <span className="text-[9px] font-mono uppercase font-medium text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      Single World Viewport
                    </span>
                  </div>

                  {/* Visual Map Canvas Simulation */}
                  <div className="relative h-80 sm:h-96 w-full bg-[#090A0E] overflow-hidden">
                    {/* Background grid */}
                    <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid-pattern-hero" width="32" height="32" patternUnits="userSpaceOnUse">
                          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid-pattern-hero)" />
                      {/* Connecting routes */}
                      <path
                        d="M 60 220 Q 150 140 240 180 T 380 90"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                      <path
                        d="M 240 180 Q 290 260 360 270"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    </svg>

                    {/* Pin 1: Paris */}
                    <div className="absolute top-16 left-16 group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <div className="w-6 h-6 rounded bg-stone-900 border border-amber-500/80 text-amber-400 flex items-center justify-center shadow-sm">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="mt-1 px-1.5 py-0.5 rounded bg-stone-900 border border-white/[0.08] text-[9px] font-mono text-stone-200 whitespace-nowrap shadow-sm">
                        Paris, France
                      </div>
                    </div>

                    {/* Pin 2: Tokyo */}
                    <div className="absolute bottom-20 left-44 group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <div className="w-6 h-6 rounded bg-stone-900 border border-emerald-500/80 text-emerald-400 flex items-center justify-center shadow-sm">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="mt-1 px-1.5 py-0.5 rounded bg-stone-900 border border-white/[0.08] text-[9px] font-mono text-stone-200 whitespace-nowrap shadow-sm">
                        Tokyo, Japan
                      </div>
                    </div>

                    {/* Pin 3: New York */}
                    <div className="absolute top-14 right-16 group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <div className="w-6 h-6 rounded bg-stone-900 border border-sky-500/80 text-sky-400 flex items-center justify-center shadow-sm">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="mt-1 px-1.5 py-0.5 rounded bg-stone-900 border border-white/[0.08] text-[9px] font-mono text-stone-200 whitespace-nowrap shadow-sm">
                        New York, USA
                      </div>
                    </div>

                    {/* Floating Hero Card Preview */}
                    <div className="absolute bottom-3 right-3 max-w-[260px] p-3 rounded bg-stone-900/95 backdrop-blur-md border border-white/[0.08] shadow-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=200&auto=format&fit=crop&q=80"
                          alt="Eiffel Tower Sunset"
                          className="w-10 h-10 rounded object-cover border border-white/[0.08]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-stone-100 truncate">Eiffel Tower Sunset</h4>
                          <p className="text-[10px] text-amber-400/90 font-mono truncate">
                            Paris, France
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-300 font-serif italic line-clamp-2 leading-relaxed bg-stone-950 p-2 rounded border border-white/[0.04]">
                        “Watched the golden twilight turn into shimmering night lights across Paris.”
                      </p>
                      <button
                        onClick={() => onNavigate('map')}
                        className="w-full py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-medium border border-stone-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>View on Map</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUE SECTION */}
      <section id="features" className="py-16 border-b border-white/[0.06] bg-[#0C0D12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">Core Pillars</span>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-stone-100 tracking-tight">
              An Architectural Model for Life Experience
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Transform fragmented camera rolls and forgotten dates into a structured personal knowledge graph.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Block 1 */}
            <div className="p-6 rounded-lg bg-[#12141C] border border-white/[0.07] text-left space-y-3">
              <div className="w-9 h-9 rounded bg-stone-900 border border-white/[0.08] flex items-center justify-center text-amber-400">
                <Bookmark className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold font-display text-stone-100">Preserve Context</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Never lose the story behind a photo. Preserve emotional context, companions, atmosphere, and milestones in high fidelity.
              </p>
            </div>

            {/* Block 2 */}
            <div className="p-6 rounded-lg bg-[#12141C] border border-white/[0.07] text-left space-y-3">
              <div className="w-9 h-9 rounded bg-stone-900 border border-white/[0.08] flex items-center justify-center text-amber-400">
                <GitFork className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold font-display text-stone-100">Interconnect Relationships</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Connect places with people, events, and memories. Understand which friends you travel with most and the spaces you share.
              </p>
            </div>

            {/* Block 3 */}
            <div className="p-6 rounded-lg bg-[#12141C] border border-white/[0.07] text-left space-y-3">
              <div className="w-9 h-9 rounded bg-stone-900 border border-white/[0.08] flex items-center justify-center text-amber-400">
                <Globe2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold font-display text-stone-100">Discover Trajectories</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                See patterns across your personal timeline. Spot growth, geographical hubs, milestone anniversaries, and travel clusters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 border-b border-white/[0.06] bg-[#0F1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-stone-100 tracking-tight">
              From a Coordinate on Map to Living Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-[#141622] border border-white/[0.07] space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400">01 / GEOCODING</div>
              <h4 className="text-sm font-semibold text-stone-100">Pin the Exact Location</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Select any location directly on the Leaflet map or search global cities with real-time Nominatim coordinate resolution.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-[#141622] border border-white/[0.07] space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400">02 / CONTEXT</div>
              <h4 className="text-sm font-semibold text-stone-100">Attach People, Photos & Moods</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Tag present companions, upload high-res memories, log dates, and let the AI summarize the narrative heart of the experience.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-[#141622] border border-white/[0.07] space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400">03 / SYNTHESIS</div>
              <h4 className="text-sm font-semibold text-stone-100">Explore the Dynamic Graph</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                The platform automatically interconnects: Person → Memory → Place → Event → Photo across your lifelong network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY MEMORY MAP */}
      <section id="innovation" className="py-16 bg-[#0C0D12]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-7 sm:p-8 rounded-lg bg-[#13151D] border border-white/[0.08] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div>
                <h3 className="text-lg font-display font-semibold text-stone-100">Why Memory Map — Built for Life Long Archiving</h3>
                <p className="text-xs text-stone-400">Transforming scattered photos and places into an intelligent connected knowledge graph</p>
              </div>

              <button
                onClick={onOpenJudgeTour}
                className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Take Product Tour</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 rounded bg-stone-900/80 border border-white/[0.05]">
                <p className="text-[10px] font-mono font-bold text-rose-400 uppercase">1. The Problem</p>
                <p className="text-xs text-stone-300 mt-1">
                  Photos get buried in unsorted camera rolls without geographical context or social connection.
                </p>
              </div>
              <div className="p-3.5 rounded bg-stone-900/80 border border-white/[0.05]">
                <p className="text-[10px] font-mono font-bold text-amber-400 uppercase">2. The Solution</p>
                <p className="text-xs text-stone-300 mt-1">
                  A personal memory intelligence system tying Places + People + Stories + Dates together seamlessly.
                </p>
              </div>
              <div className="p-3.5 rounded bg-stone-900/80 border border-white/[0.05]">
                <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase">3. The Architecture</p>
                <p className="text-xs text-stone-300 mt-1">
                  Interactive D3.js Network Graph + Leaflet Map + Firebase Cloud Storage synchronization.
                </p>
              </div>
              <div className="p-3.5 rounded bg-stone-900/80 border border-white/[0.05]">
                <p className="text-[10px] font-mono font-bold text-sky-400 uppercase">4. The Outcome</p>
                <p className="text-xs text-stone-300 mt-1">
                  A private, permanent digital atlas preserving a lifetime of meaningful stories and connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-white/[0.06] bg-[#090A0E] text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-stone-900 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Compass className="w-3 h-3" />
            </div>
            <span className="font-semibold text-stone-300">MEMORY MAP</span>
            <span className="text-stone-600">— Atlas of Life Moments</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <button onClick={() => onNavigate('overview')} className="hover:text-stone-200 transition-colors cursor-pointer">Dashboard</button>
            <button onClick={() => onNavigate('map')} className="hover:text-stone-200 transition-colors cursor-pointer">Map</button>
            <button onClick={() => onNavigate('timeline')} className="hover:text-stone-200 transition-colors cursor-pointer">Timeline</button>
            <button onClick={() => onNavigate('graph')} className="hover:text-stone-200 transition-colors cursor-pointer">Graph</button>
            <button onClick={onOpenJudgeTour} className="text-amber-400 hover:underline cursor-pointer">Product Tour</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
