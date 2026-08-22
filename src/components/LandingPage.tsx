import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Sparkles,
  Users,
  Clock,
  ArrowRight,
  GitFork,
  Image as ImageIcon,
  CheckCircle2,
  Share2,
  Calendar,
  Layers,
  Award,
  Play,
  Heart,
  TrendingUp,
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
  settings,
  authUser,
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'graph' | 'timeline' | 'ai'>('map');

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-100">
      {/* Landing Sub-Nav */}
      <div className="border-b border-slate-800/80 bg-[#0A0A0F]/80 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-violet-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-violet-400 transition-colors">How It Works</a>
            <a href="#graph-section" className="hover:text-violet-400 transition-colors">Relationship Graph</a>
            <a href="#innovation" className="hover:text-violet-400 transition-colors">Why Memory Map</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenJudgeTour}
              className="text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Product Tour</span>
            </button>
            {authUser ? (
              <button
                onClick={() => onNavigate('overview')}
                className="text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 px-3.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-xs font-semibold text-violet-300 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 px-3.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Next-Gen Personal Memory Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.1] text-white">
                “Every Place Has a <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">Story.”</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                Turn the places you've visited into a living map of your memories, people and moments. Connect places, photos, dates, friends, and AI-synthesized narratives into one searchable interactive graph.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenCreate}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 hover:shadow-violet-600/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Your First Memory</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('map')}
                  className="px-6 py-3.5 rounded-2xl bg-[#11111A] hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-violet-400" />
                  <span>Explore Interactive Map</span>
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Interactive Leaflet Map</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400" />
                  <span>Personal Relationship Graph</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>AI Story Intelligence</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Hero Preview Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto rounded-3xl p-3 bg-gradient-to-b from-slate-800/80 to-[#11111A] border border-slate-800 shadow-2xl shadow-violet-950/40 backdrop-blur-2xl">
                {/* Fake App Window Frame */}
                <div className="bg-[#0A0A0F] rounded-2xl overflow-hidden border border-slate-800 relative">
                  {/* Top Bar */}
                  <div className="px-4 py-3 bg-[#11111A] border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="text-[11px] font-mono text-slate-400 ml-2 font-medium">memorymap.app/worldwide</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-violet-400 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                      Live Map Engine
                    </span>
                  </div>

                  {/* Visual Map Canvas Simulation */}
                  <div className="relative h-80 sm:h-96 w-full bg-[#07070b] overflow-hidden">
                    {/* Background stylized grid / map paths */}
                    <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                      {/* Stylized connecting routes */}
                      <path
                        d="M 60 220 Q 150 140 240 180 T 380 90"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="3"
                        strokeDasharray="6 4"
                        className="animate-pulse"
                      />
                      <path
                        d="M 240 180 Q 290 260 360 270"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                      />
                    </svg>

                    {/* Pin 1: Paris */}
                    <div className="absolute top-16 left-16 group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-8 h-8 rounded-full bg-violet-500/40 animate-ping-slow" />
                        <div className="w-7 h-7 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/50 ring-2 ring-violet-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-1 px-2 py-0.5 rounded-md bg-[#11111A] border border-slate-800 text-[10px] font-bold text-violet-300 whitespace-nowrap shadow-md">
                        📍 Paris, France
                      </div>
                    </div>

                    {/* Pin 2: Tokyo */}
                    <div className="absolute bottom-20 left-44 group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/50 ring-2 ring-emerald-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-1 px-2 py-0.5 rounded-md bg-[#11111A] border border-slate-800 text-[10px] font-bold text-emerald-300 whitespace-nowrap shadow-md">
                        📍 Tokyo, Japan
                      </div>
                    </div>

                    {/* Pin 3: New York */}
                    <div className="absolute top-14 right-16 group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 ring-2 ring-indigo-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-1 px-2 py-0.5 rounded-md bg-[#11111A] border border-slate-800 text-[10px] font-bold text-indigo-300 whitespace-nowrap shadow-md">
                        📍 New York, USA
                      </div>
                    </div>

                    {/* Floating Hero Card Preview */}
                    <div className="absolute bottom-4 right-4 max-w-[260px] sm:max-w-[280px] p-3.5 rounded-2xl bg-[#11111A]/95 backdrop-blur-xl border border-violet-500/30 shadow-2xl shadow-black/80 space-y-2">
                      <div className="flex items-center gap-2">
                        <img
                          src="https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=200&auto=format&fit=crop&q=80"
                          alt="Eiffel Tower Sunset"
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-violet-500/40"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">Eiffel Tower Sunset</h4>
                          <p className="text-[10px] text-violet-300 flex items-center gap-1 font-medium">
                            <MapPin className="w-3 h-3" /> Paris, France
                          </p>
                          <p className="text-[9px] text-slate-400">📅 July 2026 • 2 People</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 italic line-clamp-2 leading-relaxed bg-[#0A0A0F] p-1.5 rounded-lg border border-slate-800">
                        “Watched the golden twilight turn into shimmering night lights across Paris.”
                      </p>
                      <button
                        onClick={() => onNavigate('map')}
                        className="w-full py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-violet-200 hover:text-white text-[10px] font-bold border border-violet-500/40 transition-colors flex items-center justify-center gap-1"
                      >
                        <span>View Memory on Map</span>
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

      {/* SOCIAL PROOF / VALUE SECTION: "Your Life. Connected." */}
      <section id="features" className="py-20 border-t border-slate-800 bg-[#0A0A0F] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-bold tracking-widest text-violet-400">Core Value Proposition</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Your Life. Connected.
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Transform fragmented camera rolls and forgotten calendar dates into a structured visual knowledge base.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Block 1: Remember */}
            <div className="p-8 rounded-3xl bg-[#11111A] border border-slate-800 hover:border-violet-500/40 transition-all text-left space-y-4 relative group">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">Remember</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Never lose the story behind a photo. Preserve emotional context, companions, atmosphere, and milestones.
              </p>
              <div className="pt-2 text-xs text-violet-400 font-semibold flex items-center gap-1">
                <span>Multi-photo story archives</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Block 2: Connect */}
            <div className="p-8 rounded-3xl bg-[#11111A] border border-slate-800 hover:border-indigo-500/40 transition-all text-left space-y-4 relative group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <GitFork className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">Connect</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect places with people, events, and memories. Understand which friends you travel with most and places you share.
              </p>
              <div className="pt-2 text-xs text-indigo-400 font-semibold flex items-center gap-1">
                <span>Interactive Relationship Graph</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Block 3: Discover */}
            <div className="p-8 rounded-3xl bg-[#11111A] border border-slate-800 hover:border-emerald-500/40 transition-all text-left space-y-4 relative group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white">Discover</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                See patterns across your personal timeline. Spot growth, geographical hubs, milestone anniversaries, and travel clusters.
              </p>
              <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span>Chronological Life Timeline</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / ARCHITECTURE INNOVATION */}
      <section id="how-it-works" className="py-20 border-t border-slate-800 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">Simple 3-Step Flow</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              From A Point on Map to Living Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#11111A] border border-slate-800 space-y-3">
              <div className="text-2xl font-mono font-bold text-violet-400">01</div>
              <h4 className="text-base font-bold text-white">Pin the Location</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select any location directly on the interactive Leaflet map or search cities like Nagpur, Mumbai, Pune, Goa, Delhi, or Hyderabad.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11111A] border border-slate-800 space-y-3">
              <div className="text-2xl font-mono font-bold text-indigo-400">02</div>
              <h4 className="text-base font-bold text-white">Attach People & Photos</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tag the friends present, upload high-res photos, set the date, and let the AI summarize the emotional heartbeat of the story.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#11111A] border border-slate-800 space-y-3">
              <div className="text-2xl font-mono font-bold text-emerald-400">03</div>
              <h4 className="text-base font-bold text-white">Explore the Memory Graph</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Watch the platform automatically interconnect: Person → Memory → Place → Event → Photo → Date across your lifelong network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT VALUE & ENGINEERING SPOTLIGHT */}
      <section id="innovation" className="py-16 border-t border-slate-800 bg-[#0A0A0F]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#11111A] border border-violet-500/30 shadow-2xl shadow-violet-950/50 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-white">Why Memory Map — Built For Living Memories</h3>
                  <p className="text-xs text-slate-400">Transforming scattered photos and places into an intelligent connected knowledge graph</p>
                </div>
              </div>

              <button
                onClick={onOpenJudgeTour}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Take a 60-Second Product Tour</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0A0A0F] border border-slate-800">
                <p className="text-[10px] font-bold text-rose-400 uppercase">1. The Problem</p>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Photos get lost in massive unsorted camera rolls without location context or relational meaning.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0A0A0F] border border-slate-800">
                <p className="text-[10px] font-bold text-violet-400 uppercase">2. The Solution</p>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  A personal memory intelligence system tying Places + People + Stories + Dates together seamlessly.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0A0A0F] border border-slate-800">
                <p className="text-[10px] font-bold text-emerald-400 uppercase">3. The Intelligence</p>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Interactive Personal Memory Graph + OpenStreetMap + Gemini AI Auto-Organization.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#0A0A0F] border border-slate-800">
                <p className="text-[10px] font-bold text-indigo-400 uppercase">4. The Experience</p>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  A permanent, private digital archive preserving a lifetime of meaningful stories and connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-800 bg-[#0A0A0F] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center text-white">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="font-display font-bold text-sm text-white">MEMORY MAP</span>
            <span className="text-slate-600">— Every Place Has a Story.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => onNavigate('overview')} className="hover:text-white transition-colors">Dashboard</button>
            <button onClick={() => onNavigate('map')} className="hover:text-white transition-colors">Map</button>
            <button onClick={() => onNavigate('timeline')} className="hover:text-white transition-colors">Timeline</button>
            <button onClick={() => onNavigate('graph')} className="hover:text-white transition-colors">Graph</button>
            <button onClick={onOpenJudgeTour} className="text-amber-400 hover:underline">Judge Mode</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
