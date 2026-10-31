import { JobDescription, SkillNode } from './types';

export function parseCustomJobDescription(
  company: string,
  role: string,
  stage: 'Seed / Series A' | 'Series B-D' | 'Public / FAANG',
  location: string,
  rawText: string,
  candidateSkills: SkillNode[]
): JobDescription {
  const lower = rawText.toLowerCase();

  const required: string[] = [];
  const preferred: string[] = [];

  candidateSkills.forEach((skill) => {
    const skillWords = skill.name.toLowerCase().split(/[\s(&/)]+/).filter((w) => w.length > 2);
    const hasMatch = skillWords.some((word) => lower.includes(word));

    if (hasMatch) {
      if (required.length < 4) {
        required.push(skill.name);
      } else {
        preferred.push(skill.name);
      }
    }
  });

  // If few skills matched, ensure at least the top skills from the JD context are listed
  if (required.length === 0) {
    required.push(candidateSkills[0]?.name || 'Go (Golang Concurrency & Goroutines)');
    required.push(candidateSkills[1]?.name || 'Distributed Locks & Idempotency');
  }

  // Calculate dynamic match score against candidate's demonstrated background
  let totalScore = 0;
  let totalWeight = 0;

  required.forEach((reqName) => {
    const candidateSkill = candidateSkills.find((s) => s.name === reqName);
    totalWeight += 1;
    if (candidateSkill?.status === 'mastered') {
      totalScore += 1;
    } else if (candidateSkill?.status === 'adjacent') {
      totalScore += 0.5;
    }
  });

  const calculatedMatch = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 65;

  // Clean snippet
  const cleanSnippet = rawText.replace(/\s+/g, ' ').trim();
  const snippet = cleanSnippet.length > 140 ? cleanSnippet.slice(0, 140) + '...' : cleanSnippet;

  return {
    id: `jd-${Date.now()}`,
    company: company.trim(),
    role: role.trim(),
    stage,
    location: location.trim() || 'Remote',
    matchScore: Math.max(35, calculatedMatch),
    requiredSkills: required,
    preferredSkills: preferred,
    snippet: snippet || `Hiring for ${role} at ${company}.`
  };
}
