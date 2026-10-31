'use client';

import React, { useState, useRef } from 'react';
import { UserProfileState, SkillNode } from '@/lib/types';
import { 
  SlidersHorizontal, 
  X, 
  Mic, 
  Save, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileState;
  onSaveProfile: (profile: UserProfileState, newSkills?: SkillNode[]) => void;
  isDark: boolean;
}

export const IntakeModal: React.FC<IntakeModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  isDark
}) => {
  const [formData, setFormData] = useState<UserProfileState>({ ...profile });
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [resumeText, setResumeText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: data
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to parse file');

      setUploadSuccess(`Successfully parsed ${file.name} (${json.detectedSkills?.length || 0} skills identified)`);
      
      // Update form data with candidate name if available
      if (json.candidateName && json.candidateName !== 'Candidate') {
        setFormData((prev) => ({ ...prev, name: json.candidateName }));
      }
      if (json.readinessScore) {
        setFormData((prev) => ({ ...prev, marketReadinessIndex: json.readinessScore }));
      }

      // Automatically apply new parsed skills
      if (json.detectedSkills) {
        onSaveProfile(
          {
            ...formData,
            name: json.candidateName && json.candidateName !== 'Candidate' ? json.candidateName : formData.name,
            marketReadinessIndex: json.readinessScore || formData.marketReadinessIndex
          },
          json.detectedSkills
        );
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Error processing file. Try pasting raw text.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleParseText = async () => {
    if (!resumeText.trim()) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const data = new FormData();
      data.append('text', resumeText);

      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: data
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to parse text');

      setUploadSuccess(`Successfully extracted ${json.detectedSkills?.length || 0} skills from text!`);
      
      if (json.candidateName && json.candidateName !== 'Candidate') {
        setFormData((prev) => ({ ...prev, name: json.candidateName }));
      }
      if (json.readinessScore) {
        setFormData((prev) => ({ ...prev, marketReadinessIndex: json.readinessScore }));
      }

      if (json.detectedSkills) {
        onSaveProfile(
          {
            ...formData,
            name: json.candidateName && json.candidateName !== 'Candidate' ? json.candidateName : formData.name,
            marketReadinessIndex: json.readinessScore || formData.marketReadinessIndex
          },
          json.detectedSkills
        );
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error processing resume text.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVoicePitch = () => {
    setIsListeningVoice(true);
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        voiceAspirationTranscript:
          "I am transitioning into Staff Infrastructure Engineering focusing on distributed state machines, Raft consensus, and sub-millisecond p99 latencies in Go."
      }));
      setIsListeningVoice(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  const cardBg = isDark ? 'bg-[#121520] border-[#1F2435]' : 'bg-white border-slate-200 shadow-xl';
  const innerBg = isDark ? 'bg-[#0E1018] border-[#1C202F]' : 'bg-slate-50 border-slate-200';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`p-6 rounded-2xl border max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto ${cardBg}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/40 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h3 className={`text-sm font-semibold tracking-tight ${textPrimary}`}>
                Upload Resume & Target Role Intake
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Automated Resume Extraction Engine</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Resume Ingestion Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className={`text-xs font-semibold ${textPrimary}`}>Candidate Resume</label>
            <div className="flex space-x-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  activeTab === 'upload' ? 'bg-blue-600 text-white font-medium' : textSecondary
                }`}
              >
                Upload File (PDF / TXT)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  activeTab === 'manual' ? 'bg-blue-600 text-white font-medium' : textSecondary
                }`}
              >
                Paste Text
              </button>
            </div>
          </div>

          {activeTab === 'upload' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                isUploading 
                  ? 'border-blue-500 bg-blue-500/5' 
                  : isDark ? 'border-slate-700 hover:border-blue-500 bg-[#0E1018]' : 'border-slate-300 hover:border-blue-500 bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.docx,.md"
                className="hidden"
                onChange={handleFileUpload}
              />
              {isUploading ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                  <span className="text-xs text-blue-500 font-medium">Extracting resume skills & experience...</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Upload className="h-6 w-6 text-blue-500 mx-auto" />
                  <div className={`text-xs font-semibold ${textPrimary}`}>Click to upload your Resume (PDF or TXT)</div>
                  <div className="text-[11px] text-slate-400">Upload your resume to extract competencies and experience</div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste the text of your resume here (work history, skills, projects)..."
                rows={4}
                className={`w-full p-3 rounded-xl border text-xs leading-relaxed ${
                  isDark ? 'bg-[#0E1018] border-[#1C202F] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={handleParseText}
                disabled={isUploading || !resumeText.trim()}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm transition-all disabled:opacity-50"
              >
                {isUploading ? 'Parsing Resume Text...' : 'Extract Skills from Text'}
              </button>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {uploadError && (
            <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs pt-2 border-t border-slate-200/40 dark:border-slate-800">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={textSecondary}>Candidate Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full mt-1 p-2.5 rounded-xl border ${
                  isDark ? 'bg-[#0A0C12] border-[#1C202F] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className={textSecondary}>Weekly Hours Budget</label>
              <input
                type="number"
                min="5"
                max="40"
                value={formData.weeklyHoursBudget}
                onChange={(e) => setFormData({ ...formData, weeklyHoursBudget: parseInt(e.target.value) || 10 })}
                className={`w-full mt-1 p-2.5 rounded-xl border ${
                  isDark ? 'bg-[#0A0C12] border-[#1C202F] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={textSecondary}>Target Role Title</label>
            <input
              type="text"
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              className={`w-full mt-1 p-2.5 rounded-xl border ${
                isDark ? 'bg-[#0A0C12] border-[#1C202F] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div>
            <label className={textSecondary}>Target Seniority Level</label>
            <select
              value={formData.targetSeniority}
              onChange={(e) => setFormData({ ...formData, targetSeniority: e.target.value })}
              className={`w-full mt-1 p-2.5 rounded-xl border ${
                isDark ? 'bg-[#0A0C12] border-[#1C202F] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <option value="Senior IC">Senior IC</option>
              <option value="Senior / Staff IC">Senior / Staff IC</option>
              <option value="Principal Engineer">Principal Engineer</option>
              <option value="Founding Systems Engineer">Founding Systems Engineer</option>
            </select>
          </div>

          {/* Voice Aspiration Intake with Wispr Flow */}
          <div className={`p-3 rounded-xl border space-y-1.5 ${innerBg}`}>
            <div className="flex items-center justify-between">
              <span className="text-blue-500 font-medium flex items-center space-x-1">
                <Mic className="h-3.5 w-3.5" />
                <span>Voice Aspiration Intake (Wispr Flow)</span>
              </span>
              <button
                type="button"
                onClick={handleVoicePitch}
                className="text-[10px] font-mono text-emerald-500 hover:underline"
              >
                {isListeningVoice ? 'Listening...' : 'Record Pitch'}
              </button>
            </div>
            <textarea
              value={formData.voiceAspirationTranscript}
              onChange={(e) => setFormData({ ...formData, voiceAspirationTranscript: e.target.value })}
              rows={2}
              placeholder="Speak your career goals naturally..."
              className={`w-full p-2 rounded-lg text-[11px] border ${
                isDark ? 'bg-[#151824] border-[#222738] text-slate-200' : 'bg-white border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200/40 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save & Recalibrate</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
