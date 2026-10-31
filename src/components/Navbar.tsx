'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Home as HomeIcon,
  Compass, 
  BookOpen, 
  FolderGit2, 
  Mic, 
  KanbanSquare, 
  Sun, 
  Moon, 
  User, 
  ChevronDown, 
  SlidersHorizontal,
  LogOut,
  Flame,
  Check
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAutopsyModal: () => void;
  openIntakeModal: () => void;
  readinessScore: number;
  targetRole: string;
  userName: string;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAutopsyModal,
  openIntakeModal,
  readinessScore,
  targetRole,
  userName,
  isDark,
  onToggleTheme
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'radar', label: 'Skill Gaps', icon: Compass },
    { id: 'roadmap', label: 'Study Plan', icon: BookOpen },
    { id: 'project', label: 'Projects', icon: FolderGit2 },
    { id: 'interview', label: 'Mock Interview', icon: Mic },
    { id: 'tracker', label: 'Applications', icon: KanbanSquare }
  ];

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-colors ${
      isDark ? 'border-[#1F2433] bg-[#0B0D13]/90 text-white' : 'border-slate-200 bg-white/95 text-slate-900'
    } backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand / Logo */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-2.5 text-left group focus:outline-none"
          >
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight block">WispFlow</span>
              <span className={`text-[10px] block font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Career Intelligence
              </span>
            </div>
          </button>

          {/* Center: Simplified Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? isDark 
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                      : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Actions, Theme Switch & Profile Dropdown */}
          <div className="flex items-center space-x-2.5">
            
            {/* Minimal Voice Autopsy Button */}
            <button
              onClick={openAutopsyModal}
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isDark 
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20' 
                  : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
              title="Record post-interview debrief"
            >
              <Mic className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
              <span>Voice Autopsy</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-1.5 rounded-lg border transition-all ${
                isDark
                  ? 'border-[#202534] bg-[#141722] text-amber-400 hover:text-amber-300'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Profile Menu Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center space-x-2 p-1.5 rounded-lg border transition-all ${
                  isDark
                    ? 'border-[#202534] bg-[#141722] text-white hover:bg-[#1B1F2D]'
                    : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                  AM
                </div>
                <span className="hidden lg:inline text-xs font-medium max-w-[100px] truncate">
                  {userName.split(' ')[0]}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div className={`absolute right-0 mt-2 w-64 rounded-xl border shadow-xl p-2 z-50 text-xs ${
                  isDark
                    ? 'bg-[#12151F] border-[#222738] text-white'
                    : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
                }`}>
                  {/* User Info Header */}
                  <div className={`p-2.5 rounded-lg mb-1.5 border ${
                    isDark ? 'bg-[#0E1018] border-[#1C202F]' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="font-semibold text-xs">{userName}</div>
                    <div className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {targetRole}
                    </div>
                    <div className="flex items-center space-x-1.5 mt-2 pt-2 border-t border-slate-200/20 text-[10px] font-mono">
                      <Flame className="h-3 w-3 text-amber-500" />
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Readiness Score:</span>
                      <span className="font-bold text-emerald-500">{readinessScore}%</span>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="space-y-0.5">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        openIntakeModal();
                      }}
                      className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-left transition-colors ${
                        isDark ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5 text-blue-500" />
                      <span>Edit Target Role & Resume</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        openAutopsyModal();
                      }}
                      className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-left transition-colors ${
                        isDark ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <Mic className="h-3.5 w-3.5 text-rose-500" />
                      <span>Voice Autopsy Debrief</span>
                    </button>

                    <button
                      onClick={() => {
                        onToggleTheme();
                        setProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                        isDark ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {isDark ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-slate-500" />}
                        <span>Theme: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Toggle</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-200/20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 text-xs whitespace-nowrap rounded-lg transition-all ${
                  isActive
                    ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 font-medium'
                    : isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
