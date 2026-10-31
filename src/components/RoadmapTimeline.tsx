'use client';

import React, { useState } from 'react';
import { RoadmapWeek } from '@/lib/types';
import { 
  Check, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  ExternalLink 
} from 'lucide-react';

interface RoadmapTimelineProps {
  weeks: RoadmapWeek[];
  onToggleWeekCompletion: (weekNumber: number) => void;
  onRecalibrate: () => void;
  weeklyBudgetHours: number;
  isDark: boolean;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  weeks,
  onToggleWeekCompletion,
  onRecalibrate,
  weeklyBudgetHours,
  isDark
}) => {
  const [expandedWeek, setExpandedWeek] = useState<number>(3);
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  const completedWeeksCount = weeks.filter((w) => w.completed).length;
  const progressPercentage = Math.round((completedWeeksCount / weeks.length) * 100);

  const handleRecalibrateClick = () => {
    setIsRecalibrating(true);
    setTimeout(() => {
      onRecalibrate();
      setIsRecalibrating(false);
    }, 600);
  };

  const cardBg = isDark ? 'bg-[#121520] border-[#1F2435]' : 'bg-white border-slate-200 shadow-sm';
  const innerBg = isDark ? 'bg-[#0E1018] border-[#1C202F]' : 'bg-slate-50 border-slate-200';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className={`p-5 rounded-2xl border transition-colors ${cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className={`text-sm font-semibold tracking-tight ${textPrimary}`}>
              6-Week Adaptive Study Plan
            </h2>
            <p className={`text-xs mt-1 ${textSecondary}`}>
              Calibrated to {weeklyBudgetHours} hrs/week. Completing deliverables dynamically adjusts future weeks.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-medium text-emerald-500">
              {completedWeeksCount} of {weeks.length} Completed ({progressPercentage}%)
            </span>
            <button
              onClick={handleRecalibrateClick}
              disabled={isRecalibrating}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isDark 
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' 
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 text-blue-500 ${isRecalibrating ? 'animate-spin' : ''}`} />
              <span>{isRecalibrating ? 'Adapting...' : 'Recalibrate'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {weeks.map((week) => {
          const isExpanded = expandedWeek === week.weekNumber;
          const isCurrent = !week.completed && (week.weekNumber === 1 || weeks[week.weekNumber - 2]?.completed);

          return (
            <div
              key={week.weekNumber}
              className={`rounded-2xl border transition-all ${
                isCurrent 
                  ? isDark ? 'border-blue-500/50 bg-[#121625]' : 'border-blue-400 bg-blue-50/40 shadow-sm'
                  : cardBg
              }`}
            >
              <div
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedWeek(isExpanded ? 0 : week.weekNumber)}
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWeekCompletion(week.weekNumber);
                    }}
                    className={`h-5 w-5 rounded-md flex items-center justify-center transition-all ${
                      week.completed
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'border border-slate-400 text-transparent hover:border-blue-500'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                        week.completed ? 'text-emerald-500' : isCurrent ? 'text-blue-500' : 'text-slate-400'
                      }`}>
                        Week {week.weekNumber} {isCurrent && '• Current Focus'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">~{week.estimatedHours} hrs</span>
                    </div>
                    <h3 className={`text-sm font-semibold mt-0.5 ${
                      week.completed ? 'line-through text-slate-400' : textPrimary
                    }`}>
                      {week.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    week.completed 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : isCurrent 
                        ? 'bg-blue-500/10 text-blue-500' 
                        : 'text-slate-400'
                  }`}>
                    {week.completed ? 'Completed' : isCurrent ? 'In Progress' : 'Upcoming'}
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-5 sm:px-5 pt-1 border-t border-slate-200/40 dark:border-slate-800 space-y-4 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Objective</span>
                    <p className={`mt-0.5 ${textSecondary}`}>{week.objective}</p>
                  </div>

                  <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${innerBg}`}>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-blue-500">Deliverable</span>
                      <div className={`font-semibold mt-0.5 ${textPrimary}`}>{week.deliverable}</div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{week.deliverableType}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Curated Resources</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                      {week.resources.map((res) => (
                        <a
                          key={res.id}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                            isDark 
                              ? 'bg-[#151824] border-[#222738] hover:border-slate-600 text-slate-200' 
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate pr-2">
                            <FileText className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                            <span className="truncate">{res.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{res.readTime}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
