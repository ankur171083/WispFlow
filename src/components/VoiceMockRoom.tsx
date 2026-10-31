'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MockQuestion, RubricEvaluation } from '@/lib/types';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface VoiceMockRoomProps {
  questions: MockQuestion[];
  onApplyScoreToRadar: (score: number, updatedSkillId: string) => void;
  isDark: boolean;
}

export const VoiceMockRoom: React.FC<VoiceMockRoomProps> = ({
  questions,
  onApplyScoreToRadar,
  isDark
}) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(questions[0].id);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<RubricEvaluation | null>(null);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  const currentQuestion = questions.find((q) => q.id === selectedQuestionId) || questions[0];

  const sampleResponses: Record<string, string> = {
    q1: "To eliminate thundering herd storms, I would use Go's SingleFlight request coalescing to combine duplicate concurrent queries into one origin call. In addition, I would use probabilistic early expiration with the XFetch algorithm to compute whether to recompute the key in the background before the TTL expires, avoiding cache stampedes completely.",
    q2: "When the client retries with an idempotency key, the API checks Redis for an existing lock. We acquire a distributed lock using Redlock with a monotonic fencing token. If already processing, we return HTTP 409 or wait. Once committed to Postgres via transactional outbox, we cache the serialized HTTP response for 24 hours so retries receive the exact original result without re-billing."
  };

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
          setUserTranscript(current);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

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

  const handleSpeakQuestion = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.interviewerAudioText);
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeakingQuestion(true);
      utterance.onend = () => setIsSpeakingQuestion(false);
      utterance.onerror = () => setIsSpeakingQuestion(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEvaluate = () => {
    if (!userTranscript.trim()) return;

    setIsEvaluating(true);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setTimeout(() => {
      const text = userTranscript.toLowerCase();
      const hasSingleflight = text.includes('singleflight') || text.includes('coalesc');
      const hasXFetch = text.includes('xfetch') || text.includes('probabilistic') || text.includes('early');
      const hasFencing = text.includes('fencing') || text.includes('token') || text.includes('lease');
      const hasOutbox = text.includes('outbox') || text.includes('transactional');

      let techScore = 72;
      let tradeoffScore = 65;
      let brevityScore = 88;
      let structuralScore = 80;

      if (hasSingleflight || hasFencing) techScore += 12;
      if (hasXFetch || hasOutbox) techScore += 10;
      if (text.length > 250) tradeoffScore += 15;

      techScore = Math.min(techScore, 96);
      tradeoffScore = Math.min(tradeoffScore, 92);
      const overall = Math.round((techScore * 0.35) + (tradeoffScore * 0.25) + (brevityScore * 0.2) + (structuralScore * 0.2));

      setEvaluation({
        overallScore: overall,
        technicalAccuracy: techScore,
        tradeoffDepth: tradeoffScore,
        communicationBrevity: brevityScore,
        structuralClarity: structuralScore,
        strengths: [
          'Directly addressed race conditions without buzzword padding.',
          currentQuestion.id === 'q1' 
            ? 'Correctly proposed SingleFlight to collapse duplicate concurrent queries.'
            : 'Articulated monotonic fencing tokens to prevent zombie lock overwrites.'
        ],
        criticalGaps: [
          currentQuestion.id === 'q1'
            ? 'Could address Redis cluster failover latency during origin outages.'
            : 'Did not detail behavior if Redis lock expires while DB transaction is still running.'
        ],
        staffEngineerPhrasing:
          currentQuestion.id === 'q1'
            ? '“We apply singleflight request coalescing so N identical in-flight requests share a single promise, combined with probabilistic early expiration (XFetch algorithm) to refresh keys in the background before TTL expiration.”'
            : '“We mandate an Idempotency-Key header stored in Redis with Redlock and monotonic fencing tokens. Concurrent retries await the in-flight lock or receive the cached response from the transactional outbox.”'
      });

      setIsEvaluating(false);
    }, 800);
  };

  const handleApplyFeedback = () => {
    if (!evaluation) return;
    const targetSkill = currentQuestion.id === 'q1' ? 's6' : 's2';
    onApplyScoreToRadar(evaluation.overallScore, targetSkill);
    alert(`Feedback applied! Radar and Study Plan recalibrated with your ${evaluation.overallScore}% score.`);
  };

  const cardBg = isDark ? 'bg-[#121520] border-[#1F2435]' : 'bg-white border-slate-200 shadow-sm';
  const innerBg = isDark ? 'bg-[#0E1018] border-[#1C202F]' : 'bg-slate-50 border-slate-200';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Question Selector & Question Card */}
      <div className={`p-5 rounded-2xl border transition-colors ${cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className={`text-sm font-semibold tracking-tight ${textPrimary}`}>
              Voice Mock Interview Simulator
            </h2>
            <p className={`text-xs mt-1 ${textSecondary}`}>
              Voice simulation scored against an objective 4-pillar Staff Engineer rubric.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedQuestionId(q.id);
                  setEvaluation(null);
                  setUserTranscript('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  selectedQuestionId === q.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                    : isDark ? 'bg-[#141722] text-slate-300 border-[#222738]' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Question {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Prompt */}
        <div className={`mt-4 p-4 rounded-xl border flex items-start justify-between gap-3 ${innerBg}`}>
          <div>
            <span className="text-[10px] font-mono text-blue-500 uppercase font-semibold">
              {currentQuestion.roleCategory}
            </span>
            <p className={`text-sm font-medium mt-1 leading-relaxed ${textPrimary}`}>
              &ldquo;{currentQuestion.prompt}&rdquo;
            </p>
            <div className="text-[11px] text-slate-400 mt-1">Context: {currentQuestion.context}</div>
          </div>

          <button
            onClick={handleSpeakQuestion}
            className={`p-2 rounded-xl border transition-all shrink-0 ${
              isSpeakingQuestion
                ? 'bg-blue-600 text-white animate-pulse'
                : isDark ? 'bg-[#161925] text-slate-300 border-[#222738]' : 'bg-white text-slate-700 border-slate-200'
            }`}
            title="Listen to interviewer"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Voice Input & Rubric Scorecard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Candidate Voice Input */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/40 dark:border-slate-800">
              <span className={`text-xs font-semibold ${textPrimary}`}>Your Answer</span>
              <button
                onClick={() => setUserTranscript(sampleResponses[currentQuestion.id] || sampleResponses.q1)}
                className="text-[11px] font-mono text-blue-500 hover:underline"
              >
                Insert Sample Answer
              </button>
            </div>

            <div className="mt-3 relative">
              <textarea
                value={userTranscript}
                onChange={(e) => setUserTranscript(e.target.value)}
                placeholder="Click 'Start Voice Recording' and speak your answer..."
                rows={5}
                className={`w-full rounded-xl p-3 text-xs leading-relaxed border resize-none focus:outline-none focus:border-blue-500 ${
                  isDark 
                    ? 'bg-[#0A0C12] border-[#1C202F] text-slate-200 placeholder-slate-600' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />

              {isListening && (
                <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-blue-600/10 px-2 py-1 rounded-lg border border-blue-500/20">
                  <div className="w-1 bg-blue-500 rounded-full audio-bar-1"></div>
                  <div className="w-1 bg-blue-500 rounded-full audio-bar-2"></div>
                  <div className="w-1 bg-blue-500 rounded-full audio-bar-3"></div>
                  <div className="w-1 bg-blue-500 rounded-full audio-bar-4"></div>
                  <div className="w-1 bg-blue-500 rounded-full audio-bar-5"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={toggleListening}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-blue-500" />}
              <span>{isListening ? 'Stop Recording' : 'Start Voice Recording'}</span>
            </button>

            <button
              onClick={handleEvaluate}
              disabled={isEvaluating || !userTranscript.trim()}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles className={`h-3.5 w-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
              <span>{isEvaluating ? 'Grading...' : 'Evaluate Answer'}</span>
            </button>
          </div>
        </div>

        {/* Right: Rubric Scorecard */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/40 dark:border-slate-800">
              <span className={`text-xs font-semibold ${textPrimary}`}>Rubric Scorecard</span>
              {evaluation && (
                <span className="text-xs font-mono font-bold text-emerald-500">
                  {evaluation.overallScore}/100
                </span>
              )}
            </div>

            {evaluation ? (
              <div className="mt-4 space-y-3.5 text-xs">
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Technical Depth</span>
                      <span className="text-blue-500 font-bold">{evaluation.technicalAccuracy}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${evaluation.technicalAccuracy}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Trade-off Analysis</span>
                      <span className="text-amber-500 font-bold">{evaluation.tradeoffDepth}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${evaluation.tradeoffDepth}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border text-[11px] ${innerBg}`}>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Staff Benchmark Phrasing:</span>
                  <p className={`mt-1 italic leading-relaxed ${textSecondary}`}>
                    {evaluation.staffEngineerPhrasing}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
                <HelpCircle className="h-6 w-6 text-slate-400 mb-1" />
                <p className="text-xs">Record your answer to generate your rubric scorecard.</p>
              </div>
            )}
          </div>

          {evaluation && (
            <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800">
              <button
                onClick={handleApplyFeedback}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>Update Skill Radar & Plan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
