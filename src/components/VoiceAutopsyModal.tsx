'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  BrainCircuit
} from 'lucide-react';

interface VoiceAutopsyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectRemedialModule: (concept: string, company: string) => void;
  isDark: boolean;
}

export const VoiceAutopsyModal: React.FC<VoiceAutopsyModalProps> = ({
  isOpen,
  onClose,
  onInjectRemedialModule,
  isDark
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autopsyResult, setAutopsyResult] = useState<{
    company: string;
    identifiedGap: string;
    stumbleReason: string;
    prescribedAction: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  const sampleAutopsy =
    "I just finished my Stripe backend screen. They asked about preventing double-spending in asynchronous payment webhooks under 50k req/sec. I suggested pessimistic database row locks, but they pushed me on database connection pool starvation and I choked on distributed idempotency keys and Redis fencing tokens.";

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + ' ';
          }
          setTranscript(current);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch {
          setIsListening(true);
        }
      } else {
        setIsListening(true);
      }
    }
  };

  const handleAnalyze = () => {
    if (!transcript.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      setAutopsyResult({
        company: 'Stripe',
        identifiedGap: 'Distributed Locks & Idempotent Keys',
        stumbleReason: 'Relied on pessimistic database locks which cause DB pool starvation under high concurrency.',
        prescribedAction: 'Injected a 48-Hour Micro-Sprint on Redis Redlock Fencing Tokens into Week 2.'
      });
      setIsAnalyzing(false);
    }, 800);
  };

  const handleApplyAndClose = () => {
    if (autopsyResult) {
      onInjectRemedialModule(autopsyResult.identifiedGap, autopsyResult.company);
    }
    onClose();
  };

  const cardBg = isDark ? 'bg-[#121520] border-[#1F2435]' : 'bg-white border-slate-200 shadow-xl';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`p-6 rounded-2xl border max-w-lg w-full space-y-4 ${cardBg}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/40 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div>
              <h3 className={`text-sm font-semibold tracking-tight ${textPrimary}`}>
                Post-Interview Voice Autopsy
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Wispr Flow Real-Time Debrief</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className={`text-xs leading-relaxed ${textSecondary}`}>
          Speak for 60 seconds about what tripped you up during a real interview. WispFlow auto-extracts your blind spots and dynamically adjusts your study roadmap.
        </p>

        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Click 'Record Voice Debrief' or type your notes: 'I just had my interview with Stripe. They asked about...'"
            rows={4}
            className={`w-full p-3 rounded-xl border text-xs leading-relaxed resize-none focus:outline-none focus:border-rose-500 ${
              isDark 
                ? 'bg-[#0A0C12] border-[#1C202F] text-slate-200 placeholder-slate-600' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />

          <button
            onClick={() => setTranscript(sampleAutopsy)}
            className="absolute bottom-2 right-2 text-[10px] font-mono text-blue-500 hover:underline"
          >
            Insert Sample Debrief
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={toggleListening}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 text-rose-500" />}
            <span>{isListening ? 'Stop Recording' : 'Record Voice Debrief'}</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !transcript.trim()}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Extracting...' : 'Run Autopsy'}</span>
          </button>
        </div>

        {autopsyResult && (
          <div className="p-4 rounded-xl border border-rose-500/30 space-y-2 text-xs bg-rose-500/5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-rose-500 flex items-center space-x-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Identified Blocker: {autopsyResult.identifiedGap}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Target: {autopsyResult.company}</span>
            </div>

            <p className={`text-[11px] ${textSecondary}`}>
              <span className="font-semibold text-slate-400">Diagnosis:</span> {autopsyResult.stumbleReason}
            </p>

            <div className="p-2.5 rounded-lg border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] flex items-start space-x-1.5 bg-emerald-500/5">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>{autopsyResult.prescribedAction}</span>
            </div>

            <button
              onClick={handleApplyAndClose}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm"
            >
              <span>Patch Roadmap & Log to CRM</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
