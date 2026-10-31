'use client';

import React, { useState } from 'react';
import { Mic, Volume2, Sparkles, X, ChevronRight, Code2 } from 'lucide-react';

export const WisprFlowBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="relative border-b border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-[#0E1220] to-emerald-950/30 px-4 py-2.5 text-xs text-gray-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-400">
            <Mic className="h-3 w-3" />
          </div>
          <div>
            <span className="font-semibold text-blue-300">Wispr Flow Integration:</span>{' '}
            <span className="text-gray-300">
              Voice-first architecture built by voice. Try the live Voice Mock Room & 60-second Post-Interview Autopsy.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-center">
          <span className="inline-flex items-center space-x-1 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Voice Engine Ready</span>
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-gray-400 hover:text-white p-0.5"
            title="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
