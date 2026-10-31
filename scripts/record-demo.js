const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
  const outputDir = path.resolve(__dirname, '../public/demo');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Launching browser for video recording...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: outputDir,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const wait = (ms) => page.waitForTimeout(ms);

  // 1. HOME SCREEN OVERVIEW
  console.log('1. Home Screen Overview...');
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await wait(1800);
  await page.evaluate(() => window.scrollBy({ top: -300, behavior: 'smooth' }));
  await wait(1500);

  // Toggle Theme (Dark -> Light -> Dark)
  console.log('Testing Light / Dark mode toggle...');
  const themeToggle = await page.$('button[title*="Mode"]');
  if (themeToggle) {
    await themeToggle.click();
    await wait(1800);
    await themeToggle.click();
    await wait(1200);
  }

  // 2. RESUME UPLOAD MODAL
  console.log('2. Opening Resume Intake Modal...');
  const uploadBtn = await page.getByRole('button', { name: 'Upload Your Resume (PDF / Text)' }).first();
  if (uploadBtn) {
    await uploadBtn.click();
    await wait(1500);

    // Switch to Paste Text tab
    const pasteTab = await page.getByRole('button', { name: 'Paste Text' }).first();
    if (pasteTab) {
      await pasteTab.click();
      await wait(1000);
      const textarea = await page.locator('textarea').first();
      await textarea.fill(
        'Alex Morgan\nSenior Distributed Systems Engineer\nSkills: Go concurrency, goroutines, channels, Docker, Kubernetes, PostgreSQL indexing, Redis caching, microservices, Kafka event streams.'
      );
      await wait(1200);

      const extractBtn = await page.getByRole('button', { name: 'Extract Skills from Text' }).first();
      if (extractBtn) {
        await extractBtn.click();
        await wait(2500);
      }
    }

    // Close modal
    const closeBtn = await page.getByRole('button', { name: 'Close' }).first();
    if (closeBtn) {
      await closeBtn.click();
      await wait(1200);
    }
  }

  // 3. SKILL GAPS & CUSTOM JD
  console.log('3. Navigating to Skill Gaps...');
  await page.locator('header nav').getByRole('button', { name: 'Skill Gaps', exact: true }).click();
  await wait(2200);

  // Switch between companies
  console.log('Switching benchmark companies...');
  const vercelBtn = await page.getByRole('button', { name: /Vercel/i }).first();
  if (vercelBtn) {
    await vercelBtn.click();
    await wait(1500);
  }
  const supabaseBtn = await page.getByRole('button', { name: /Supabase/i }).first();
  if (supabaseBtn) {
    await supabaseBtn.click();
    await wait(1500);
  }

  // Toggle DAG Tree view
  const treeBtn = await page.getByRole('button', { name: 'Tree', exact: true }).first();
  if (treeBtn) {
    await treeBtn.click();
    await wait(1500);
    const radarBtn = await page.getByRole('button', { name: 'Radar', exact: true }).first();
    if (radarBtn) await radarBtn.click();
    await wait(1200);
  }

  // Add Custom JD
  console.log('Adding Custom Assessor JD...');
  const addJdBtn = await page.getByRole('button', { name: 'Add Custom JD' }).first();
  if (addJdBtn) {
    await addJdBtn.click();
    await wait(1200);

    await page.getByPlaceholder('e.g. Google, Anthropic, Netflix').fill('Anthropic');
    await page.getByPlaceholder('e.g. Senior Backend Engineer').fill('AI Infrastructure Systems Engineer');
    await page.getByPlaceholder('Paste the requirements, qualifications, and role description here...').fill(
      'We are looking for an AI Infrastructure Systems Engineer to build high-throughput model inference pipelines. Requirements: Deep knowledge of Go concurrency, Redis distributed locks, Raft consensus replication, and sub-millisecond p99 latencies under high scale.'
    );
    await wait(1500);

    const submitJd = await page.getByRole('button', { name: 'Extract Skills & Benchmark' }).first();
    if (submitJd) {
      await submitJd.click();
      await wait(2500);
    }
  }

  // 4. STUDY PLAN TAB
  console.log('4. Navigating to Study Plan...');
  await page.locator('header nav').getByRole('button', { name: 'Study Plan', exact: true }).click();
  await wait(2000);

  // Expand week 3
  const week3 = await page.getByText('Cache Invalidation Strategies & Thundering Herd Defense').first();
  if (week3) {
    await week3.click();
    await wait(1800);
  }

  // Recalibrate button
  const recalibrateBtn = await page.getByRole('button', { name: /Recalibrate/i }).first();
  if (recalibrateBtn) {
    await recalibrateBtn.click();
    await wait(1800);
  }

  // 5. PROJECTS TAB
  console.log('5. Navigating to Projects...');
  await page.locator('header nav').getByRole('button', { name: 'Projects', exact: true }).click();
  await wait(2000);

  // Switch project tabs
  const scopeTab = await page.getByRole('button', { name: 'Scope (MVP vs Stretch)' }).first();
  if (scopeTab) {
    await scopeTab.click();
    await wait(1500);
  }

  const readmeTab = await page.getByRole('button', { name: 'README' }).first();
  if (readmeTab) {
    await readmeTab.click();
    await wait(1500);
  }

  const scaffoldTab = await page.getByRole('button', { name: 'Starter Scaffold' }).first();
  if (scaffoldTab) {
    await scaffoldTab.click();
    await wait(1500);
  }

  // 6. MOCK INTERVIEW ROOM
  console.log('6. Navigating to Mock Interview...');
  await page.locator('header nav').getByRole('button', { name: 'Mock Interview', exact: true }).click();
  await wait(2000);

  // Insert sample answer
  const sampleAnswerBtn = await page.getByText('Insert Sample Answer').first();
  if (sampleAnswerBtn) {
    await sampleAnswerBtn.click();
    await wait(1200);
  }

  // Click Evaluate Answer
  const evaluateBtn = await page.getByRole('button', { name: 'Evaluate Answer' }).first();
  if (evaluateBtn) {
    await evaluateBtn.click();
    console.log('Waiting for rubric evaluation...');
    await wait(3000);
  }

  // Apply feedback
  const applyScoreBtn = await page.getByRole('button', { name: 'Update Skill Radar & Plan' }).first();
  if (applyScoreBtn) {
    page.once('dialog', (dialog) => dialog.accept());
    await applyScoreBtn.click();
    await wait(1800);
  }

  // 7. APPLICATION CRM
  console.log('7. Navigating to Applications CRM...');
  await page.locator('header nav').getByRole('button', { name: 'Applications', exact: true }).click();
  await wait(2000);

  // Click A/B variant cards
  const variantA = await page.getByText('Variant A: Distributed Systems').first();
  if (variantA) {
    await variantA.click();
    await wait(1200);
    await variantA.click(); // Reset filter
    await wait(1000);
  }

  // 8. VOICE AUTOPSY MODAL
  console.log('8. Opening Voice Autopsy...');
  const autopsyBtn = await page.getByRole('button', { name: /Voice Autopsy/i }).first();
  if (autopsyBtn) {
    await autopsyBtn.click();
    await wait(1500);

    const sampleDebrief = await page.getByText('Insert Sample Debrief').first();
    if (sampleDebrief) {
      await sampleDebrief.click();
      await wait(1200);
    }

    const runAutopsyBtn = await page.getByRole('button', { name: 'Run Autopsy' }).first();
    if (runAutopsyBtn) {
      await runAutopsyBtn.click();
      await wait(2500);
    }

    const patchBtn = await page.getByRole('button', { name: 'Patch Roadmap & Log to CRM' }).first();
    if (patchBtn) {
      await patchBtn.click();
      await wait(1500);
    }
  }

  // 9. RETURN HOME
  console.log('9. Returning to Home...');
  await page.locator('header nav').getByRole('button', { name: 'Home', exact: true }).click();
  await wait(2500);

  // Close context to finish writing the video
  console.log('Closing browser context to save video...');
  await context.close();
  await browser.close();

  // Find the generated video file in outputDir and copy to wispflow-demo.webm
  const files = fs.readdirSync(outputDir).filter((f) => f.endsWith('.webm') && f !== 'wispflow-demo.webm');
  if (files.length > 0) {
    const latestVideo = files[files.length - 1];
    const srcPath = path.join(outputDir, latestVideo);
    const destPath = path.join(outputDir, 'wispflow-demo.webm');
    fs.copyFileSync(srcPath, destPath);
    const stats = fs.statSync(destPath);
    console.log(`Demo video successfully saved to: ${destPath} (${Math.round(stats.size / 1024)} KB)`);
  }

  console.log('Video recording completed successfully!');
}

run().catch((err) => {
  console.error('Error during recording:', err);
  process.exit(1);
});
