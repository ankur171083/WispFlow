'use client';

import React, { useState } from 'react';
import { PortfolioProject } from '@/lib/types';
import { 
  FolderGit2, 
  Layers, 
  Terminal, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Play, 
  ShieldCheck, 
  Cpu
} from 'lucide-react';

interface ProjectStudioProps {
  project: PortfolioProject;
  isDark: boolean;
}

export const ProjectStudio: React.FC<ProjectStudioProps> = ({ project, isDark }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'spec' | 'readme' | 'starter'>('architecture');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardBg = isDark ? 'bg-[#121520] border-[#1F2435]' : 'bg-white border-slate-200 shadow-sm';
  const innerBg = isDark ? 'bg-[#0E1018] border-[#1C202F]' : 'bg-slate-50 border-slate-200';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Project Header */}
      <div className={`p-5 rounded-2xl border transition-colors ${cardBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <FolderGit2 className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                Portfolio Blueprint
              </span>
              <span className="text-xs text-slate-400">Bridges 3 Skill Gaps</span>
            </div>
            <h2 className={`text-lg font-bold mt-1.5 tracking-tight ${textPrimary}`}>
              {project.title}
            </h2>
            <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${textSecondary}`}>
              {project.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 self-start md:self-center">
            {project.targetedGaps.map((gap, i) => (
              <span
                key={i}
                className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20"
              >
                {gap}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-[11px] font-mono uppercase">Tech Stack:</span>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, i) => (
                <span key={i} className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                  isDark ? 'bg-[#151824] border-[#222738] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-mono text-emerald-500 flex items-center space-x-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Senior Interview Approved</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
        <div className={`flex border-b px-4 ${isDark ? 'border-[#1F2435] bg-[#0E1018]' : 'border-slate-200 bg-slate-50'}`}>
          {[
            { id: 'architecture', label: 'Architecture', icon: Layers },
            { id: 'spec', label: 'Scope (MVP vs Stretch)', icon: Terminal },
            { id: 'readme', label: 'README', icon: Code2 },
            { id: 'starter', label: 'Starter Scaffold', icon: Cpu }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 text-xs font-medium border-b-2 transition-all ${
                  isActive
                    ? 'border-blue-500 text-blue-500 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'architecture' && (
          <div className="p-5 space-y-4 text-xs">
            <p className={textSecondary}>{project.architectureSummary}</p>
            <div className={`p-4 rounded-xl border font-mono text-[11px] overflow-x-auto leading-relaxed ${
              isDark ? 'bg-[#0A0C12] border-[#1C202F] text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}>
              <pre className="text-emerald-400 font-semibold mb-2">// LedgerSync Sequence Architecture</pre>
              <pre>{`[Client Request] ──> [1. Redis Idempotency Lease (Redlock + Fence)]
                     ──> [2. Go SingleFlight Deduplication]
                     ──> [3. Raft Consensus Node Cluster]
                     ──> [4. Transactional Outbox + Postgres MVCC]`}</pre>
            </div>
            <div className={`p-3.5 rounded-xl border flex items-start space-x-2.5 ${
              isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <Play className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">60-Second Interview Demo Hook:</span>
                <p className={`mt-0.5 ${textSecondary}`}>{project.recruiterDemoHook}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spec' && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className={`p-4 rounded-xl border ${innerBg}`}>
              <div className="font-semibold text-blue-500 mb-2">Core MVP Requirements</div>
              <ul className={`space-y-1.5 ${textSecondary}`}>
                {project.mvpRequirements.map((r, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <Check className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`p-4 rounded-xl border ${innerBg}`}>
              <div className="font-semibold text-emerald-500 mb-2">Senior Stretch Features</div>
              <ul className={`space-y-1.5 ${textSecondary}`}>
                {project.stretchFeatures.map((r, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">+</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'readme' && (
          <div className="p-5 text-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-slate-400">README.md</span>
              <button
                onClick={() => handleCopy(project.readmeMarkdown)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded border text-[11px] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className={`p-4 rounded-xl border font-mono text-[11px] whitespace-pre-wrap max-h-[300px] overflow-y-auto ${
              isDark ? 'bg-[#0A0C12] border-[#1C202F] text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}>
              {project.readmeMarkdown}
            </pre>
          </div>
        )}

        {activeTab === 'starter' && (
          <div className="p-5 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className={`font-semibold ${textPrimary}`}>Repository Starter Scaffold</h4>
                <p className={`text-[11px] ${textSecondary}`}>Pre-configured Go module with Docker Compose and test suite.</p>
              </div>
              <button
                onClick={() => alert("Scaffold generated! You can clone the template or download the archive.")}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-medium text-xs shadow-sm hover:bg-blue-500"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Scaffold</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`p-3 rounded-xl border ${innerBg}`}>
                <div className="font-mono text-blue-500 text-[11px] font-semibold">📁 /cmd/server/main.go</div>
                <div className="text-[11px] text-slate-400 mt-1">HTTP & gRPC server entry point.</div>
              </div>
              <div className={`p-3 rounded-xl border ${innerBg}`}>
                <div className="font-mono text-blue-500 text-[11px] font-semibold">📁 /pkg/idempotency/lock.go</div>
                <div className="text-[11px] text-slate-400 mt-1">Redis Redlock lease manager.</div>
              </div>
              <div className={`p-3 rounded-xl border ${innerBg}`}>
                <div className="font-mono text-blue-500 text-[11px] font-semibold">📄 docker-compose.yml</div>
                <div className="text-[11px] text-slate-400 mt-1">Redis cluster + Postgres 16 instances.</div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
