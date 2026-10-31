'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  Mic, 
  KanbanSquare, 
  ArrowRight, 
  Flame, 
  SlidersHorizontal,
  FolderGit2,
  Upload,
  Play,
  X,
  Download,
  Film,
  Volume2
} from 'lucide-react';

interface HomeDashboardProps {
  userName: string;
  targetRole: string;
  readinessScore: number;
  criticalGapsCount: number;
  currentWeekNumber: number;
  onNavigate: (tab: string) => void;
  openIntakeModal: () => void;
  isDark: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userName,
  targetRole,
  readinessScore,
  criticalGapsCount,
  currentWeekNumber,
  onNavigate,
  openIntakeModal,
  isDark
}) => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const steps = [
    {
      step: '01',
      title: 'Analyze Skill Gaps',
      description: 'Upload any resume and benchmark against custom company JDs. Identifies verified skills vs. critical blockers.',
      badge: `${criticalGapsCount} Critical Blockers Found`,
      badgeColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      actionLabel: 'View Skill Gaps',
      tabId: 'radar',
      icon: Compass
    },
    {
      step: '02',
      title: 'Follow Your Study Plan',
      description: 'A 6-week calibrated sprint with official documentation, RFCs, and verifiable code deliverables.',
      badge: `Week ${currentWeekNumber} In Progress`,
      badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      actionLabel: 'Open Study Plan',
      tabId: 'roadmap',
      icon: BookOpen
    },
    {
      step: '03',
      title: 'Build Portfolio Projects',
      description: 'Synthesize your skill gaps into production-ready architectures (LedgerSync) with GitHub scaffolds.',
      badge: 'Flagship Blueprint Ready',
      badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      actionLabel: 'View Projects',
      tabId: 'project',
      icon: FolderGit2
    },
    {
      step: '04',
      title: 'Practice Voice Interviews',
      description: 'Simulate real technical screens using Wispr Flow voice dictation, scored against a 4-pillar rubric.',
      badge: 'Staff Engineer Rubric',
      badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      actionLabel: 'Start Mock Interview',
      tabId: 'interview',
      icon: Mic
    },
    {
      step: '05',
      title: 'Track Applications & A/B Tests',
      description: 'Log job applications and test which resume variants yield the highest recruiter callback rates.',
      badge: 'A/B Testing Active',
      badgeColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      actionLabel: 'View CRM',
      tabId: 'tracker',
      icon: KanbanSquare
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Clean Minimalist Hero Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
        isDark ? 'bg-[#121520] border-[#1F2435]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-mono font-medium uppercase tracking-wider px-2 py-0.5 rounded ${
                isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                Welcome Back, {userName.split(' ')[0]}
              </span>

              {/* Watch Video Demo with Voice */}
              <button
                onClick={() => setShowVideoModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 border border-emerald-500/30 transition-all shadow-sm"
              >
                <Volume2 className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                <span>Watch Demo with Voiceover</span>
              </button>
            </div>

            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Your Career Acceleration Operating System
            </h1>
            <p className={`text-xs sm:text-sm max-w-xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Targeting: <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{targetRole}</span>
            </p>
          </div>

          {/* Readiness Meter */}
          <div className={`p-4 rounded-xl border flex flex-col items-center justify-center min-w-[180px] text-center ${
            isDark ? 'bg-[#0E1018] border-[#1C202F]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Readiness Score</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-500">
              {readinessScore}%
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${readinessScore}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5 font-mono">Target: 90% Readiness</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-5 pt-4 border-t border-slate-200/40 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={openIntakeModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm transition-all"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Your Resume (PDF / Text)</span>
            </button>
            <button
              onClick={() => onNavigate('radar')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                isDark ? 'bg-[#151824] border-[#222738] text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-blue-500" />
              <span>Add Custom Company JD</span>
            </button>
            <button
              onClick={() => setShowVideoModal(true)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                isDark ? 'bg-[#151824] border-[#222738] text-emerald-400 hover:text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <Film className="h-3.5 w-3.5" />
              <span>Watch Video Demo</span>
            </button>
          </div>

          <button
            onClick={openIntakeModal}
            className="flex items-center space-x-1 font-medium text-slate-400 hover:text-blue-500 transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Target Role Settings</span>
          </button>
        </div>
      </div>

      {/* Guided 5-Step Process */}
      <div>
        <div className="mb-4">
          <h2 className={`text-base font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            How It Works — Step by Step
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Follow these 5 core stages to prepare for and pass senior-level technical screens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isDark 
                    ? 'bg-[#121520] border-[#1F2435] hover:border-slate-700' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      STEP {item.step}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2.5 mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {item.title}
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/40 dark:border-slate-800">
                  <button
                    onClick={() => onNavigate(item.tabId)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-blue-500 hover:text-blue-600 group"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Demo Modal with Voiceover */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`p-6 rounded-2xl border max-w-4xl w-full space-y-4 max-h-[92vh] overflow-y-auto ${
            isDark ? 'bg-[#121520] border-[#1F2435]' : 'bg-white border-slate-200 shadow-2xl'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/40 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Volume2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    WispFlow Career OS — Video Demo (with Voiceover)
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">End-to-End Walkthrough with Synchronized Audio Narration</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href="/demo/wispflow-demo.mp4"
                  download="wispflow-demo.mp4"
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                >
                  <Download className="h-3 w-3" />
                  <span>Download MP4</span>
                </a>
                <button onClick={() => setShowVideoModal(false)} className="text-slate-400 hover:text-slate-200 p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="rounded-xl overflow-hidden bg-black border border-slate-800 aspect-video shadow-lg">
              <video
                src="/demo/wispflow-demo.mp4"
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Chapters & Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#0E1018] border-[#1C202F]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-emerald-500 font-bold text-[10px]">0:00 - 0:13</div>
                <div className="font-medium mt-0.5 text-[11px]">Home & Light/Dark Mode</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#0E1018] border-[#1C202F]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-emerald-500 font-bold text-[10px]">0:13 - 0:27</div>
                <div className="font-medium mt-0.5 text-[11px]">Resume Text Extraction</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#0E1018] border-[#1C202F]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-emerald-500 font-bold text-[10px]">0:27 - 0:45</div>
                <div className="font-medium mt-0.5 text-[11px]">Radar & Anthropic JD</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-[#0E1018] border-[#1C202F]' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-mono text-emerald-500 font-bold text-[10px]">1:08 - 1:38</div>
                <div className="font-medium mt-0.5 text-[11px]">Voice Mock & Autopsy</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
