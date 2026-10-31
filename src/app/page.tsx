'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HomeDashboard } from '@/components/HomeDashboard';
import { SkillRadar } from '@/components/SkillRadar';
import { RoadmapTimeline } from '@/components/RoadmapTimeline';
import { ProjectStudio } from '@/components/ProjectStudio';
import { VoiceMockRoom } from '@/components/VoiceMockRoom';
import { ApplicationTracker } from '@/components/ApplicationTracker';
import { VoiceAutopsyModal } from '@/components/VoiceAutopsyModal';
import { IntakeModal } from '@/components/IntakeModal';

import {
  INITIAL_USER_PROFILE,
  INITIAL_SKILLS,
  TARGET_JOB_DESCRIPTIONS,
  INITIAL_ROADMAP,
  PORTFOLIO_PROJECT,
  MOCK_INTERVIEW_QUESTIONS,
  INITIAL_RESUME_VARIANTS,
  INITIAL_APPLICATIONS
} from '@/lib/mockData';

import {
  UserProfileState,
  SkillNode,
  RoadmapWeek,
  ApplicationItem,
  ApplicationStage,
  JobDescription
} from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfileState>(INITIAL_USER_PROFILE);
  const [skills, setSkills] = useState<SkillNode[]>(INITIAL_SKILLS);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>(TARGET_JOB_DESCRIPTIONS);
  const [selectedJdId, setSelectedJdId] = useState<string>('jd-stripe');
  const [roadmapWeeks, setRoadmapWeeks] = useState<RoadmapWeek[]>(INITIAL_ROADMAP);
  const [applications, setApplications] = useState<ApplicationItem[]>(INITIAL_APPLICATIONS);
  const [resumeVariants, setResumeVariants] = useState(INITIAL_RESUME_VARIANTS);

  // Modals state
  const [isAutopsyOpen, setIsAutopsyOpen] = useState(false);
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);

  // Sync document root class with isDark
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Add Custom Job Description
  const handleAddJd = (newJd: JobDescription) => {
    setJobDescriptions((prev) => [newJd, ...prev]);
    setSelectedJdId(newJd.id);
  };

  // Delete Job Description
  const handleDeleteJd = (id: string) => {
    setJobDescriptions((prev) => {
      const filtered = prev.filter((jd) => jd.id !== id);
      if (selectedJdId === id && filtered.length > 0) {
        setSelectedJdId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Toggle week completion & recalculate readiness score
  const handleToggleWeek = (weekNumber: number) => {
    setRoadmapWeeks((prev) =>
      prev.map((w) => (w.weekNumber === weekNumber ? { ...w, completed: !w.completed } : w))
    );

    setUserProfile((prev) => {
      const completedCount = roadmapWeeks.filter((w) =>
        w.weekNumber === weekNumber ? !w.completed : w.completed
      ).length;
      const newScore = Math.min(95, Math.round(50 + (completedCount / roadmapWeeks.length) * 45));
      return { ...prev, marketReadinessIndex: newScore };
    });
  };

  // Recalibrate roadmap hours
  const handleRecalibrate = () => {
    setRoadmapWeeks((prev) =>
      prev.map((w) => {
        if (!w.completed) {
          return {
            ...w,
            estimatedHours: Math.max(8, w.estimatedHours - 1)
          };
        }
        return w;
      })
    );
  };

  // Apply Mock Interview score directly to skill radar
  const handleApplyScoreToRadar = (score: number, updatedSkillId: string) => {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === updatedSkillId) {
          return {
            ...s,
            status: score >= 80 ? 'mastered' : 'adjacent',
            demonstratedProof: `Scored ${score}% in Voice Mock Interview verification session.`
          };
        }
        return s;
      })
    );

    setUserProfile((prev) => ({
      ...prev,
      marketReadinessIndex: Math.min(98, prev.marketReadinessIndex + 6)
    }));
  };

  // Voice Autopsy Remedial Module Injection
  const handleInjectRemedialModule = (concept: string, company: string) => {
    setRoadmapWeeks((prev) =>
      prev.map((w) =>
        w.weekNumber === 2
          ? {
              ...w,
              title: `${w.title} [Autopsy Patched: ${concept}]`,
              completed: false,
              estimatedHours: w.estimatedHours + 4
            }
          : w
      )
    );

    setApplications((prev) =>
      prev.map((app) =>
        app.company.toLowerCase() === company.toLowerCase()
          ? {
              ...app,
              autopsyNotes: `Post-Interview Voice Autopsy: Stumbled on ${concept}. Remedial sprint scheduled.`
            }
          : app
      )
    );
  };

  // Move application stage in Kanban CRM
  const handleMoveStage = (appId: string, newStage: ApplicationStage) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, stage: newStage } : app))
    );
  };

  // Add new job application
  const handleAddApplication = (newApp: Partial<ApplicationItem>) => {
    const item: ApplicationItem = {
      id: `app-${Date.now()}`,
      company: newApp.company || 'Tech Startup',
      role: newApp.role || 'Senior Software Engineer',
      stage: newApp.stage || 'Applied',
      companyType: newApp.companyType || 'Series B-D',
      resumeVariantId: newApp.resumeVariantId || 'var-a',
      appliedDate: newApp.appliedDate || new Date().toISOString().split('T')[0],
      keySkills: newApp.keySkills || ['Distributed Systems', 'Go']
    };
    setApplications((prev) => [item, ...prev]);
  };

  // Handle profile save with new parsed skills from resume
  const handleSaveProfile = (newProfile: UserProfileState, newSkills?: SkillNode[]) => {
    setUserProfile(newProfile);
    if (newSkills && newSkills.length > 0) {
      setSkills(newSkills);
    }
  };

  const criticalGapsCount = skills.filter((s) => s.status === 'critical_gap').length;
  const currentWeekNumber = roadmapWeeks.find((w) => !w.completed)?.weekNumber || 1;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark ? 'bg-[#0B0D13] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAutopsyModal={() => setIsAutopsyOpen(true)}
        openIntakeModal={() => setIsIntakeOpen(true)}
        readinessScore={userProfile.marketReadinessIndex}
        targetRole={userProfile.targetRole}
        userName={userProfile.name}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-8 sm:py-12">
        
        {/* Tab 0: Home Overview */}
        {activeTab === 'home' && (
          <HomeDashboard
            userName={userProfile.name}
            targetRole={userProfile.targetRole}
            readinessScore={userProfile.marketReadinessIndex}
            criticalGapsCount={criticalGapsCount}
            currentWeekNumber={currentWeekNumber}
            onNavigate={(tab) => setActiveTab(tab)}
            openIntakeModal={() => setIsIntakeOpen(true)}
            isDark={isDark}
          />
        )}

        {/* Tab 1: Skill Gaps with Custom JD Support */}
        {activeTab === 'radar' && (
          <SkillRadar
            skills={skills}
            jobDescriptions={jobDescriptions}
            selectedJdId={selectedJdId}
            onSelectJd={setSelectedJdId}
            onAddJd={handleAddJd}
            onDeleteJd={handleDeleteJd}
            onNavigateToRoadmap={() => setActiveTab('roadmap')}
            isDark={isDark}
          />
        )}

        {/* Tab 2: Study Plan */}
        {activeTab === 'roadmap' && (
          <RoadmapTimeline
            weeks={roadmapWeeks}
            onToggleWeekCompletion={handleToggleWeek}
            onRecalibrate={handleRecalibrate}
            weeklyBudgetHours={userProfile.weeklyHoursBudget}
            isDark={isDark}
          />
        )}

        {/* Tab 3: Projects */}
        {activeTab === 'project' && (
          <ProjectStudio project={PORTFOLIO_PROJECT} isDark={isDark} />
        )}

        {/* Tab 4: Mock Interview */}
        {activeTab === 'interview' && (
          <VoiceMockRoom
            questions={MOCK_INTERVIEW_QUESTIONS}
            onApplyScoreToRadar={handleApplyScoreToRadar}
            isDark={isDark}
          />
        )}

        {/* Tab 5: Applications CRM */}
        {activeTab === 'tracker' && (
          <ApplicationTracker
            applications={applications}
            resumeVariants={resumeVariants}
            onMoveStage={handleMoveStage}
            onAddApplication={handleAddApplication}
            isDark={isDark}
          />
        )}

      </main>

      {/* Minimal Footer */}
      <footer className={`border-t py-6 text-xs transition-colors ${
        isDark ? 'border-[#1F2433] text-slate-500' : 'border-slate-200 text-slate-500 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            WispFlow Career OS • Built with <span className="text-blue-500 font-medium">Wispr Flow</span> Voice Engine
          </div>
          <div className="text-[11px] text-slate-400">
            Dynamic JD Benchmarking & Real-Time Skill Matching
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VoiceAutopsyModal
        isOpen={isAutopsyOpen}
        onClose={() => setIsAutopsyOpen(false)}
        onInjectRemedialModule={handleInjectRemedialModule}
        isDark={isDark}
      />

      <IntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
        isDark={isDark}
      />

    </div>
  );
}
