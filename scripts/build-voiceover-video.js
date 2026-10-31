const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ffmpegPath = path.resolve(__dirname, '../node_modules/ffmpeg-static/ffmpeg.exe');
const demoDir = path.resolve(__dirname, '../public/demo');
const tempDir = path.resolve(__dirname, '../scripts/temp-audio');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Segments and their starting delays in milliseconds
const segments = [
  {
    id: 1,
    startMs: 0,
    text: "Welcome to WispFlow Career OS, an autonomous career acceleration engine. We designed a clean, minimalist dashboard with instant light and dark mode toggles, guiding candidates through a clear five-step journey from skill gap analysis to job offers."
  },
  {
    id: 2,
    startMs: 13000,
    text: "Candidates begin by uploading their resume or pasting their experience. Our intelligent extraction engine parses core technical competencies in real time, immediately benchmarking their background and computing an initial market readiness score."
  },
  {
    id: 3,
    startMs: 27000,
    text: "Under Skill Gaps, candidates explore an interactive eight-axis radar benchmarked against real hiring standards at Stripe, Vercel, and Supabase. Assessors can also click Add Custom J D to paste any real-world job description, like Anthropic, and watch the system recalculate critical blockers on the fly."
  },
  {
    id: 4,
    startMs: 45000,
    text: "Next, the platform generates a calibrated six-week study plan targeting those specific gaps. Instead of bloated video tutorials, each sprint curates official R F C s, whitepapers, and verifiable deliverables, with dynamic plan recalibration as you progress."
  },
  {
    id: 5,
    startMs: 56000,
    text: "To prove competence to hiring managers, WispFlow architects enterprise portfolio projects like LedgerSync, bridging distributed locks, Raft consensus, and Go concurrency, complete with architectural decision records and starter repository scaffolds."
  },
  {
    id: 6,
    startMs: 68000,
    text: "Before real interviews, candidates enter the Voice Mock Room powered by Wispr Flow. Practice technical questions aloud and receive immediate evaluation against a Staff Engineer four-pillar rubric, complete with model phrasing suggestions."
  },
  {
    id: 7,
    startMs: 80000,
    text: "Our self-learning Application C R M tracks your hiring pipeline and runs regression analytics across resume variants, revealing which keywords and tech stacks yield the highest callback rates."
  },
  {
    id: 8,
    startMs: 88000,
    text: "With post-interview voice autopsies and closed-loop feedback, WispFlow accelerates your path to senior engineering roles. Built with Wispr Flow."
  }
];

console.log('Synthesizing speech segments via Windows SpeechSynthesizer...');

segments.forEach((seg) => {
  const wavPath = path.join(tempDir, `seg_${seg.id}.wav`);
  // Generate using PowerShell System.Speech
  const psScript = `
    Add-Type -AssemblyName System.Speech
    $s = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $s.SelectVoice("Microsoft Zira Desktop")
    $s.Rate = 0
    $s.SetOutputToWaveFile("${wavPath.replace(/\\/g, '\\\\')}")
    $s.Speak("${seg.text.replace(/"/g, '`"')}")
    $s.Dispose()
  `;
  const psFile = path.join(tempDir, `synth_${seg.id}.ps1`);
  fs.writeFileSync(psFile, psScript, 'utf8');
  execSync(`powershell -ExecutionPolicy Bypass -File "${psFile}"`);
  console.log(`Generated segment ${seg.id} audio.`);
});

console.log('Mixing audio segments with exact video delay offsets...');

// Build ffmpeg filter_complex for delayed amix
let inputs = '';
let filterParts = [];
segments.forEach((seg, index) => {
  inputs += ` -i "${path.join(tempDir, `seg_${seg.id}.wav`)}"`;
  filterParts.push(`[${index + 1}:a]adelay=${seg.startMs}|${seg.startMs}[a${index}]`);
});

const mixedInputs = segments.map((_, i) => `[a${i}]`).join('');
const filterComplex = `${filterParts.join(';')};${mixedInputs}amix=inputs=${segments.length}:normalize=0[aout]`;

const inputVideo = path.join(demoDir, 'wispflow-demo.webm');
const outputWebm = path.join(demoDir, 'wispflow-demo-voiced.webm');
const outputMp4 = path.join(demoDir, 'wispflow-demo.mp4');

console.log('Muxing audio with video...');
const ffmpegCmd = `"${ffmpegPath}" -y -i "${inputVideo}"${inputs} -filter_complex "${filterComplex}" -map 0:v -map "[aout]" -c:v copy -c:a libopus -b:a 128k "${outputWebm}"`;

execSync(ffmpegCmd, { stdio: 'inherit' });
console.log(`Voiced WebM created at: ${outputWebm}`);

// Also generate MP4 version for LinkedIn / Twitter / universal playback
console.log('Creating universal MP4 version...');
const mp4Cmd = `"${ffmpegPath}" -y -i "${outputWebm}" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 192k "${outputMp4}"`;
execSync(mp4Cmd, { stdio: 'inherit' });
console.log(`Voiced MP4 created at: ${outputMp4}`);

// Overwrite the primary wispflow-demo.webm with the voiced version
fs.copyFileSync(outputWebm, path.join(demoDir, 'wispflow-demo.webm'));
console.log('Updated wispflow-demo.webm with the voiced edition!');

console.log('Demo video with synchronized voice narration complete!');
