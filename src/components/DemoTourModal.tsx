import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  GitFork,
  Clock,
  Compass,
  Users,
  CheckCircle2,
  ArrowRight,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';
import { AppView } from '../types';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: AppView) => void;
  onResetData: () => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onResetData,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome to Memory Map',
      tagline: '“Every Place Has a Story”',
      description:
        'Memory Map is an AI-powered personal memory intelligence platform. Explore real connected journeys across locations, people, and stories.',
      actionLabel: '1. Explore Interactive Map View',
      targetView: 'map' as AppView,
      icon: MapPin,
      color: 'text-violet-400',
    },
    {
      title: 'Interactive Relationship Graph Engine',
      tagline: 'Places + People + Memories Visualized as Nodes',
      description:
        'Explore our interactive physics canvas graph. Drag nodes, adjust repulsion & gravity physics, click any companion or location to inspect connected memories.',
      actionLabel: '2. Launch Relationship Graph',
      targetView: 'graph' as AppView,
      icon: GitFork,
      color: 'text-indigo-400',
    },
    {
      title: 'Chronological Timeline Journey',
      tagline: 'Your Life, One Place at a Time',
      description:
        'Vertical timeline tracking milestone moments across your journey. Filter by year, category, and companions.',
      actionLabel: '3. View Timeline Journey',
      targetView: 'timeline' as AppView,
      icon: Clock,
      color: 'text-emerald-400',
    },
    {
      title: 'AI Intelligence & Auto-Organization',
      tagline: 'Powered by Gemini AI Intelligence',
      description:
        'Create new memories with automatic geocoding, emotional synthesis, auto-tagging, and relationship auto-linking with one-click “Organize with AI”.',
      actionLabel: '4. Open Dashboard Overview',
      targetView: 'overview' as AppView,
      icon: Sparkles,
      color: 'text-amber-400',
    },
  ];

  const step = tourSteps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    onNavigate(step.targetView);
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0F]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#11111A] border border-violet-500/30 rounded-3xl shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">Interactive Product Tour</h2>
              <p className="text-[11px] text-violet-300">Quick walkthrough of key capabilities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Card */}
        <div className="p-6 rounded-3xl bg-[#0A0A0F] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Feature {currentStep + 1} of {tourSteps.length}
            </span>
            <StepIcon className={`w-5 h-5 ${step.color}`} />
          </div>

          <div>
            <h3 className="text-lg font-bold font-display text-white">{step.title}</h3>
            <p className="text-xs text-violet-300 font-semibold mt-0.5">{step.tagline}</p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{step.description}</p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5">
          {tourSteps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-violet-500' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={onResetData}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset to sample memories"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample Data</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
          >
            <span>{step.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
