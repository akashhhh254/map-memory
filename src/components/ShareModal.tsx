import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Download,
  MapPin,
  Calendar,
  Sparkles,
  X,
  Send,
  ExternalLink,
} from 'lucide-react';
import { Memory, Person, UserSettings } from '../types';

interface ShareModalProps {
  memory: Memory | null;
  people: Person[];
  onClose: () => void;
  settings: UserSettings;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  memory,
  people,
  onClose,
  settings,
}) => {
  const [copied, setCopied] = useState(false);

  if (!memory) return null;

  const connectedPeople = people.filter((p) => memory.peopleIds.includes(p.id));
  const shareUrl = `${window.location.origin}/#memory=${memory.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Memory Map: ${memory.title}`,
          text: `“${memory.aiSummary || memory.story}” - At ${memory.location.placeName}, ${memory.location.city}`,
          url: shareUrl,
        });
      } catch (e) {
        // User cancelled or failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">Share Memory Story</h2>
              <p className="text-[11px] text-slate-400">Share your interactive place story card</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Share Card Preview */}
        <div className="rounded-3xl overflow-hidden bg-slate-950 border border-purple-500/30 shadow-2xl p-5 space-y-4 relative">
          {memory.photos?.[0] && (
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <img
                src={memory.photos[0]}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-600/80 backdrop-blur-md">
                  📍 {memory.location.city}
                </span>
                <span className="text-[10px] text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-full">
                  {memory.date}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-base font-bold text-white font-display leading-tight">
              {memory.title}
            </h3>
            <p className="text-xs text-purple-200/90 italic leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-purple-500/20">
              “{memory.aiSummary || memory.story}”
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="font-bold text-slate-300">Memory Map</span>
            </div>
            <span>“Every Place Has a Story”</span>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-950 text-slate-300 border border-slate-700 text-xs truncate focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleNativeShare}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Share to Friends & Socials</span>
          </button>
        </div>
      </div>
    </div>
  );
};
