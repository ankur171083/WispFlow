'use client';

import React, { useState } from 'react';
import { ApplicationItem, ApplicationStage, ResumeVariant } from '@/lib/types';
import { 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Plus 
} from 'lucide-react';

interface ApplicationTrackerProps {
  applications: ApplicationItem[];
  resumeVariants: ResumeVariant[];
  onMoveStage: (appId: string, newStage: ApplicationStage) => void;
  onAddApplication: (app: Partial<ApplicationItem>) => void;
  isDark: boolean;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  resumeVariants,
  onMoveStage,
  onAddApplication,
  isDark
}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCompany, setNewCompany] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('');
  const [newStage, setNewStage] = useState<ApplicationStage>('Applied');

  const stages: ApplicationStage[] = ['Wishlist', 'Applied', 'Screening', 'Technical Round', 'Offer', 'Rejected'];

  const filteredApps = selectedVariantId === 'all'
    ? applications
    : applications.filter((app) => app.resumeVariantId === selectedVariantId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole) return;
    onAddApplication({
      company: newCompany,
      role: newRole,
      stage: newStage,
      companyType: 'Series B-D',
      resumeVariantId: 'var-a',
      appliedDate: new Date().toISOString().split('T')[0],
      keySkills: ['Go', 'Distributed Systems']
    });
    setNewCompany('');
    setNewRole('');
    setShowAddModal(false);
  };

  const cardBg = isDark ? 'bg-[#121520] border-[#1F2435]' : 'bg-white border-slate-200 shadow-sm';
  const innerBg = isDark ? 'bg-[#0E1018] border-[#1C202F]' : 'bg-slate-50 border-slate-200';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Banner: A/B Resume Intelligence */}
      <div className={`p-5 rounded-2xl border transition-colors ${cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <h2 className={`text-sm font-semibold tracking-tight ${textPrimary}`}>
                Application CRM & Resume A/B Analytics
              </h2>
            </div>
            <p className={`text-xs mt-1 ${textSecondary}`}>
              Track your hiring pipeline and discover which resume variants yield the highest response rates.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm transition-all self-start sm:self-center"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log Application</span>
          </button>
        </div>

        {/* A/B Variant Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-200/40 dark:border-slate-800">
          {resumeVariants.map((variant) => {
            const isSelected = selectedVariantId === variant.id;
            return (
              <div
                key={variant.id}
                onClick={() => setSelectedVariantId(isSelected ? 'all' : variant.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10'
                    : innerBg
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-3.5 w-3.5 text-blue-500" />
                    <span className={`font-semibold text-xs ${textPrimary}`}>{variant.name}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    variant.interviewConversionRate >= 30 ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
                  }`}>
                    {variant.interviewConversionRate}% Conversion
                  </span>
                </div>
                <p className={`text-[11px] mt-1 ${textSecondary}`}>{variant.tagline}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-800">
                  <span>{variant.activeApplicationsCount} Applications</span>
                  <span className="text-blue-500">{isSelected ? 'Active Filter (Click to reset)' : 'Filter by variant'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Learned Pattern */}
        <div className={`mt-3 p-3 rounded-xl border flex items-center space-x-2 text-xs ${innerBg}`}>
          <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <div className={textSecondary}>
            <span className={`font-semibold ${textPrimary}`}>Learned Pattern:</span> Variant A (Go + Distributed Systems) yields a <span className="font-bold text-emerald-500">3.8x higher callback rate</span> than general product engineering resumes.
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stage) => {
          const stageApps = filteredApps.filter((a) => a.stage === stage);

          return (
            <div
              key={stage}
              className={`p-3 rounded-2xl border flex flex-col min-h-[340px] ${cardBg}`}
            >
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-200/40 dark:border-slate-800">
                <span className={`text-xs font-semibold ${textPrimary}`}>{stage}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {stageApps.length}
                </span>
              </div>

              <div className="space-y-2 flex-1">
                {stageApps.map((app) => (
                  <div
                    key={app.id}
                    className={`p-3 rounded-xl border transition-all text-xs ${innerBg}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`font-semibold ${textPrimary}`}>{app.company}</span>
                      <span className="text-[9px] font-mono text-slate-400">{app.appliedDate.slice(5)}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5 truncate">{app.role}</div>

                    {app.autopsyNotes && (
                      <div className="mt-2 text-[10px] text-slate-400 italic">
                        &ldquo;{app.autopsyNotes.slice(0, 45)}...&rdquo;
                      </div>
                    )}

                    {stage !== 'Offer' && stage !== 'Rejected' && (
                      <div className="mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-800 flex justify-end">
                        <button
                          onClick={() => {
                            const nextIndex = stages.indexOf(stage) + 1;
                            if (nextIndex < stages.length) {
                              onMoveStage(app.id, stages[nextIndex]);
                            }
                          }}
                          className="text-blue-500 hover:text-blue-600 font-mono text-[10px] flex items-center space-x-1"
                        >
                          <span>Advance</span>
                          <ArrowRight className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {stageApps.length === 0 && (
                  <div className="h-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-[10px] text-slate-400">
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`p-5 rounded-2xl border max-w-md w-full space-y-3 ${cardBg}`}>
            <h3 className={`text-sm font-semibold ${textPrimary}`}>Log Job Application</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe, Linear"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className={`w-full mt-1 p-2.5 rounded-xl border ${
                    isDark ? 'bg-[#0A0C12] border-[#1C202F] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label className="text-slate-400">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Infrastructure Engineer"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className={`w-full mt-1 p-2.5 rounded-xl border ${
                    isDark ? 'bg-[#0A0C12] border-[#1C202F] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-500"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
