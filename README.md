# WispFlow Career OS ⚡
> **Autonomous Career Intelligence & Real-Time Voice Simulation Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat)](LICENSE)

---

## 💡 Overview

Tech hiring is frequently an uncalibrated black box:
- Job seekers send dozens of resumes with zero feedback on which specific technical competencies caused rejections.
- Generic study roadmaps prescribe 40-hour video tutorials without addressing actual production engineering standards.
- Standard portfolio projects (to-do apps, tutorial clones) fail to demonstrate senior-level systems competence.
- Candidates lack realistic, rubric-scored technical screen practice before real interview loops.

**WispFlow Career OS** closes this loop. By pairing automated resume parsing with empirical job descriptions, WispFlow calculates candidate-market gap deltas, generates adaptive week-by-week study sprints, architects enterprise-grade portfolio blueprints, conducts real-time voice mock interviews scored against a Staff Engineer rubric, and tracks application outcomes with A/B resume testing.

---

## 🎬 Video Demo & Walkthrough

A high-definition walkthrough with synchronized voiceover narration is available in the repository:
- **Universal MP4 Video:** [`public/demo/wispflow-demo.mp4`](public/demo/wispflow-demo.mp4)
- **WebM Video:** [`public/demo/wispflow-demo.webm`](public/demo/wispflow-demo.webm)
- **Live In-App Player:** Launch the app and click **"Watch Demo with Voiceover"** on the Home dashboard.

---

## 🚀 Quickstart

### Prerequisites
- Node.js 18.x or later (Node.js 20+ recommended)
- npm or pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ankur171083/WispFlow.git
cd WispFlow

# 2. Install dependencies
npm install

# 3. Start the local development server (with Turbopack)
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## ✨ Core Modules

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                WispFlow Career OS                                │
└────────┬──────────────────────┬──────────────────────┬───────────────────┬───────┘
         │                      │                      │                   │
         ▼                      ▼                      ▼                   ▼
  [ Resume Intake ]      [ Skill Gap Radar ]    [ Adaptive Sprints ]  [ Voice Mock Room ]
  • PDF Text Extraction  • 8-Axis SVG Topology  • Curated Whitepapers • Web Speech VAD
  • Keyword Taxonomy     • Custom Target JDs    • Weekly Deliverables • 4-Pillar Rubric
  • Readiness Baseline   • DAG Ontology Tree    • Dynamic Recalibrate • Staff Model Phrasing
```

### 1. Automated Resume Parsing & Ingestion
- Upload PDF, TXT, or paste experience text directly.
- Server-side text extraction evaluates competencies across Languages, Distributed Systems, Databases, Cloud & Infra, and System Design.
- Calculates an initial **Market Readiness Score**.

### 2. Empirical Skill-Gap Radar & Custom Target JDs
- Interactive 8-axis SVG radar and Directed Acyclic Graph (DAG) ontology tree.
- Pre-indexed benchmark JDs (Stripe, Vercel, Supabase, OpenAI) plus support for adding custom job descriptions (e.g., Anthropic, Netflix).
- Distinguishes **Mastered** skills from **Adjacent** competencies and **Critical Market Blockers**.

### 3. Adaptive 6-Week Study Plan
- Time-calibrated sprints tailored to weekly study availability.
- Curates high-density engineering resources (official documentation, RFCs, VLDB whitepapers).
- Active recall diagnostics and weekly verifiable deliverables.
- Dynamic plan recalibration when interview scores improve.

### 4. Enterprise Portfolio Blueprint Studio
- Replaces generic tutorial projects with high-signal architectures (*LedgerSync*: distributed locking with Redlock, Raft consensus replication, and Go concurrency).
- Includes sequence diagrams, MVP requirements vs. senior stretch scope, and starter repository files (`main.go`, `lock.go`, `docker-compose.yml`).

### 5. Voice Mock Interview Room (Wispr Flow Enabled)
- Speech synthesis for realistic interviewer prompts.
- Web Speech audio ingestion and conversational turn-taking.
- Instant evaluation against a 4-pillar rubric:
  - Technical Accuracy & Depth (30%)
  - Trade-off & Constraint Awareness (25%)
  - Communication Brevity (25%)
  - Structural / STAR Clarity (20%)
- Side-by-side **Staff Engineer Benchmark Phrasing**.

### 6. Application CRM & Resume A/B Analytics
- Kanban pipeline (`Wishlist` → `Applied` → `Screening` → `Technical Round` → `Offer`).
- Tracks multiple resume variations (e.g., *Variant A: Distributed Systems Focus* @ 42.8% callback vs. *Variant B: Full-Stack Product* @ 11.1%).
- Closed-loop regression insights highlighting high-converting keyword combinations.

### 7. Post-Interview Voice Autopsy
- 60-second voice debrief immediately following real-world interview screens.
- Extracts missed technical concepts, logs questions to the CRM under that company, and injects a 48-hour remedial patch into the study roadmap.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 + Custom Glassmorphism
- **Icons:** Lucide React
- **Text & Audio Extraction:** `pdf-parse`, Web Speech API, `SpeechSynthesis`
- **Automation & Video:** Playwright, `ffmpeg-static`

---

## 📁 Repository Structure

```
WispFlow/
├── public/
│   └── demo/
│       ├── wispflow-demo.mp4       # 720p HD demo video with voiceover
│       └── wispflow-demo.webm      # High-fidelity WebM video
├── scripts/
│   ├── record-demo.js              # Automated browser demo recording
│   └── build-voiceover-video.js    # Synchronized audio synthesis & muxing
├── src/
│   ├── app/
│   │   ├── api/parse-resume/       # PDF & text resume extraction endpoint
│   │   ├── globals.css             # Obsidian dark & clean light mode theme tokens
│   │   ├── layout.tsx              # Root HTML shell & Geist typography
│   │   └── page.tsx                # Central state machine & tab controller
│   ├── components/
│   │   ├── ApplicationTracker.tsx  # Kanban CRM & A/B variant analytics
│   │   ├── HomeDashboard.tsx       # Guided onboarding & video demo player
│   │   ├── IntakeModal.tsx         # Resume upload & aspiration modal
│   │   ├── Navbar.tsx              # Navigation, theme toggle, and profile menu
│   │   ├── ProjectStudio.tsx       # Flagship portfolio blueprint viewer
│   │   ├── RoadmapTimeline.tsx     # Adaptive week-by-week sprint accordion
│   │   ├── SkillRadar.tsx          # 8-axis SVG radar & custom JD ingestion
│   │   ├── VoiceAutopsyModal.tsx   # Post-interview voice debrief modal
│   │   └── VoiceMockRoom.tsx       # Web Speech mock interview room & rubric
│   └── lib/
│       ├── jdParser.ts             # Custom JD keyword & match score algorithm
│       ├── mockData.ts             # Pre-seeded engineering profile & JDs
│       ├── types.ts                # TypeScript domain models
│       └── utils.ts                # Tailwind clsx utility
└── README.md
```

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
