'use client';

import React, { useState } from 'react';
import { SkillNode, JobDescription } from '@/lib/types';
import { parseCustomJobDescription } from '@/lib/jdParser';
import { 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Network, 
  Radar, 
  ArrowRight,
  Plus,
  Trash2,
  Edit3,
  X,
  Sparkles
} from 'lucide-react';

interface SkillRadarProps {
  skills: SkillNode[];
  jobDescriptions: JobDescription[];
  selectedJdId: string;
  onSelectJd: (id: string) => void;
  onAddJd: (jd: JobDescription) => void;
  onDeleteJd: (id: string) => void;
  onNavigateToRoadmap: () => void;
  isDark: boolean;
}

export const SkillRadar: React.FC<SkillRadarProps> = ({
  skills,
  jobDescriptions,
  selectedJdId,
  onSelectJd,
  onAddJd,
  onDeleteJd,
  onNavigateToRoadmap,
  isDark
}) => {
  const [viewMode, setViewMode] = useState<'radar' | 'graph'>('radar');
  const [activeSkillId, setActiveSkillId] = useState<string>('s2');
  const [showAddJdModal, setShowAddJdModal] = useState<boolean>(false);

  // New Custom JD form state
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newStage, setNewStage] = useState<'Seed / Series A' | 'Series B-D' | 'Public / FAANG'>('Series B-D');
  const [newLocation, setNewLocation] = useState('Remote');
  const [newJdText, setNewJdText] = useState('');

  const currentJd = jobDescriptions.find((jd) => jd.id === selectedJdId) || jobDescriptions[0] || {
    id: 'jd-default',
    company: 'Custom Company',
    role: 'Software Engineer',
    stage: 'Series B-D',
    location: 'Remote',
    matchScore: 70,
    requiredSkills: [],
    preferredSkills: [],
    snippet: 'No job descriptions added yet.'
  };

  const activeSkill = skills.find((s) => s.id === activeSkillId) || skills[0] || {
    id: 's-none',
    name: 'General Engineering',
    category: 'System Design',
    status: 'adjacent',
    marketFrequency: 0.8,
    demonstratedProof: 'Evaluated against target role.',
    description: 'Technical competence.'
  };

  const criticalGapsCount = skills.filter((s) => s.status === 'critical_gap').length;
  const adjacentCount = skills.filter((s) => s.status === 'adjacent').length;
  const masteredCount = skills.filter((s) => s.status === 'mastered').length;

  // Radar geometry calculations (8-axis polygon)
  const size = 300;
  const center = size / 2;
  const radius = size * 0.38;
  const totalAxes = Math.max(skills.length, 3);

  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const x = center + radius * valueRatio * Math.cos(angle);
    const y = center + radius * valueRatio * Math.sin(angle);
    return { x, y };
  };

  const candidatePoints = skills.map((skill, i) => {
    let score = skill.status === 'mastered' ? 0.95 : skill.status === 'adjacent' ? 0.6 : 0.25;
    const { x, y } = getCoordinates(i, score);
    return `${x},${y}`;
  }).join(' ');

  const marketPoints = skills.map((skill, i) => {
    const score = skill.marketFrequency;
    const { x, y } = getCoordinates(i, score);
    return `${x},${y}`;
  }).join(' ');

  const handleCreateJd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole || !newJdText) return;

    const parsedJd = parseCustomJobDescription(
      newCompany,
      newRole,
      newStage,
      newLocation,
      newJdText,
      skills
    );

    onAddJd(parsedJd);
    onSelectJd(parsedJd.id);

    // Reset and close
    setNewCompany('');
    setNewRole('');
    setNewJdText('');
    setShowAddJdModal(false);
  };

  const cardBg = isDark ? 'bg-[#121520] border-[#1F2435]' : 'bg-white border-slate-200 shadow-sm';
  const innerBg = isDark ? 'bg-[#0E1018] border-[#1C202F]' : 'bg-slate-50 border-slate-200';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Banner: Benchmark Employer Selector & Add JD Action */}
      <div className={`p-5 rounded-2xl border transition-colors ${cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-blue-500" />
              <h2 className={`text-sm font-semibold tracking-tight ${textPrimary}`}>
                Company Job Descriptions
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Assessor Inputs Enabled
              </span>
            </div>
            <p className={`text-xs mt-1 ${textSecondary}`}>
              Add or select any company job description to recalculate skill blockers against your specific hiring rubric.
            </p>
          </div>

          <button
            onClick={() => setShowAddJdModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-center"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Custom JD</span>
          </button>
        </div>

        {/* Company Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800">
          {jobDescriptions.map((jd) => {
            const isSelected = jd.id === selectedJdId;
            return (
              <div key={jd.id} className="flex items-center">
                <button
                  onClick={() => onSelectJd(jd.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                      : isDark
                        ? 'bg-[#141722] text-slate-300 border-[#222738] hover:text-white'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span>{jd.company}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected 
                      ? 'bg-white/20 text-white' 
                      : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {jd.matchScore}%
                  </span>
                </button>
                {jobDescriptions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteJd(jd.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500 ml-0.5"
                    title={`Delete ${jd.company}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected JD Summary */}
        <div className="mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className={textSecondary}>Active Benchmark:</span>{' '}
            <span className={`font-semibold ${textPrimary}`}>{currentJd.company} — {currentJd.role}</span>{' '}
            <span className="text-slate-400">({currentJd.stage} • {currentJd.location})</span>
          </div>
          <div className="text-[11px] text-slate-400 italic truncate max-w-sm">
            &ldquo;{currentJd.snippet.slice(0, 85)}...&rdquo;
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Map + Skill Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Radar or DAG Tree */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-semibold ${textPrimary}`}>Skill Match Topology</span>
              
              <div className={`flex items-center space-x-1 p-1 rounded-lg border ${innerBg}`}>
                <button
                  onClick={() => setViewMode('radar')}
                  className={`flex items-center space-x-1 px-2.5 py-1 text-xs rounded-md transition-all ${
                    viewMode === 'radar'
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : textSecondary
                  }`}
                >
                  <Radar className="h-3 w-3" />
                  <span>Radar</span>
                </button>
                <button
                  onClick={() => setViewMode('graph')}
                  className={`flex items-center space-x-1 px-2.5 py-1 text-xs rounded-md transition-all ${
                    viewMode === 'graph'
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : textSecondary
                  }`}
                >
                  <Network className="h-3 w-3" />
                  <span>Tree</span>
                </button>
              </div>
            </div>

            {/* Metric Summary Counters */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className={`p-2.5 rounded-xl border ${innerBg}`}>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Blockers</div>
                <div className="text-sm font-mono font-bold text-rose-500 mt-0.5">{criticalGapsCount} Skills</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${innerBg}`}>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Adjacent</div>
                <div className="text-sm font-mono font-bold text-amber-500 mt-0.5">{adjacentCount} Skills</div>
              </div>
              <div className={`p-2.5 rounded-xl border ${innerBg}`}>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Mastered</div>
                <div className="text-sm font-mono font-bold text-emerald-500 mt-0.5">{masteredCount} Skills</div>
              </div>
            </div>

            {/* SVG Visualizer */}
            {viewMode === 'radar' ? (
              <div className="flex flex-col items-center justify-center py-2">
                <svg width={size} height={size} className="overflow-visible">
                  {[0.25, 0.5, 0.75, 1.0].map((ratio, i) => (
                    <circle
                      key={i}
                      cx={center}
                      cy={center}
                      r={radius * ratio}
                      fill="none"
                      stroke={isDark ? "#202534" : "#e2e8f0"}
                      strokeWidth="1"
                      strokeDasharray={ratio === 1.0 ? "none" : "3,3"}
                    />
                  ))}

                  {skills.map((_, i) => {
                    const { x, y } = getCoordinates(i, 1.0);
                    return (
                      <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={x}
                        y2={y}
                        stroke={isDark ? "#202534" : "#e2e8f0"}
                        strokeWidth="1"
                      />
                    );
                  })}

                  <polygon
                    points={marketPoints}
                    fill={isDark ? "rgba(59, 130, 246, 0.08)" : "rgba(59, 130, 246, 0.05)"}
                    stroke="rgba(59, 130, 246, 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />

                  <polygon
                    points={candidatePoints}
                    fill={isDark ? "rgba(16, 185, 129, 0.25)" : "rgba(16, 185, 129, 0.2)"}
                    stroke="#10B981"
                    strokeWidth="2"
                  />

                  {skills.map((skill, i) => {
                    let score = skill.status === 'mastered' ? 0.95 : skill.status === 'adjacent' ? 0.6 : 0.25;
                    const { x, y } = getCoordinates(i, score);
                    const isSelected = skill.id === activeSkillId;

                    let nodeColor = skill.status === 'mastered' ? '#10B981' : skill.status === 'adjacent' ? '#F59E0B' : '#F43F5E';

                    return (
                      <g
                        key={skill.id}
                        className="cursor-pointer"
                        onClick={() => setActiveSkillId(skill.id)}
                      >
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? 7 : 4.5}
                          fill={nodeColor}
                          stroke={isDark ? "#0B0D13" : "#FFFFFF"}
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                </svg>

                <div className="flex items-center space-x-6 text-[11px] text-slate-400 mt-2 font-mono">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>Your Demonstrated Proof</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full border border-blue-500 border-dashed"></span>
                    <span>{currentJd.company} Requirements</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {skills.map((s) => {
                  const isSelected = s.id === activeSkillId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setActiveSkillId(s.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10'
                          : innerBg
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${textPrimary}`}>{s.name}</span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono ${
                          s.status === 'mastered' ? 'bg-emerald-500/10 text-emerald-500' :
                          s.status === 'adjacent' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-rose-500/10 text-rose-500'
                        }`}>
                          {s.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Skill Detail Card */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between ${cardBg}`}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/40 dark:border-slate-800">
              <span className={`text-xs font-semibold ${textPrimary}`}>Skill Breakdown</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {activeSkill.category}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2">
                {activeSkill.status === 'mastered' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                )}
                <h3 className={`text-sm font-semibold tracking-tight ${textPrimary}`}>
                  {activeSkill.name}
                </h3>
              </div>

              <div className="mt-2 flex items-center space-x-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] ${
                  activeSkill.status === 'mastered'
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : activeSkill.status === 'adjacent'
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {activeSkill.status === 'mastered' ? 'Mastered' : activeSkill.status === 'adjacent' ? 'Adjacent' : 'Critical Blocker'}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {(activeSkill.marketFrequency * 100).toFixed(0)}% JD Demand
                </span>
              </div>

              <p className={`text-xs mt-3 leading-relaxed ${textSecondary}`}>
                {activeSkill.description}
              </p>

              <div className={`mt-4 p-3 rounded-xl border text-xs ${innerBg}`}>
                <div className="text-[10px] font-mono uppercase text-slate-400">Current Proof on Resume</div>
                <div className={`mt-1 ${textPrimary}`}>{activeSkill.demonstratedProof}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200/40 dark:border-slate-800">
            <button
              onClick={onNavigateToRoadmap}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <span>View Sprint Module for this Gap</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Add Custom Job Description Modal */}
      {showAddJdModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`p-6 rounded-2xl border max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto ${cardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/40 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <h3 className={`text-sm font-semibold ${textPrimary}`}>Add Custom Company Job Description</h3>
              </div>
              <button onClick={() => setShowAddJdModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateJd} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={textSecondary}>Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Anthropic, Netflix"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className={`w-full mt-1 p-2.5 rounded-xl border ${
                      isDark ? 'bg-[#0A0C12] border-[#1C202F] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={textSecondary}>Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Backend Engineer"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className={`w-full mt-1 p-2.5 rounded-xl border ${
                      isDark ? 'bg-[#0A0C12] border-[#1C202F] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={textSecondary}>Company Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as any)}
                    className={`w-full mt-1 p-2.5 rounded-xl border ${
                      isDark ? 'bg-[#0A0C12] border-[#1C202F] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Seed / Series A">Seed / Series A</option>
                    <option value="Series B-D">Series B-D Scaleup</option>
                    <option value="Public / FAANG">Public / FAANG / Big Tech</option>
                  </select>
                </div>
                <div>
                  <label className={textSecondary}>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Remote, San Francisco, New York"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className={`w-full mt-1 p-2.5 rounded-xl border ${
                      isDark ? 'bg-[#0A0C12] border-[#1C202F] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={textSecondary}>Job Description Text (Paste full JD)</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Paste the requirements, qualifications, and role description here..."
                  value={newJdText}
                  onChange={(e) => setNewJdText(e.target.value)}
                  className={`w-full mt-1 p-3 rounded-xl border resize-none ${
                    isDark ? 'bg-[#0A0C12] border-[#1C202F] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200/40 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddJdModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm"
                >
                  Extract Skills & Benchmark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
