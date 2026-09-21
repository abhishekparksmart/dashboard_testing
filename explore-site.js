const { chromium } = require('@playwright/test');
const { Env } = require('./config/env');

(async () => {
  Env.load();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page    = await context.newPage();

  const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
  await page.goto(`${baseUrl}/web/dashboard`);
  await page.waitForLoadState('networkidle', { timeout: 20000 });

  // Expand Site Management
  const mgmtBtn = page.getByRole('button', { name: /Site Manage/i }).first();
  if (await mgmtBtn.isVisible()) {
    await mgmtBtn.click();
    await page.waitForTimeout(1000);
  }

  // Get all links that appeared
  const links = await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(el => el.innerText.trim()).filter(t => t.length > 0));
  console.log('Available links after clicking Site Management:', links);

  await browser.close();
})();
