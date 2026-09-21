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

  // Expand Operator Management
  const mgmtBtn = page.getByRole('button', { name: /Operator Manage/i }).first();
  if (await mgmtBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    const expanded = await mgmtBtn.getAttribute('aria-expanded');
    if (expanded !== 'true') await mgmtBtn.click();
    await page.waitForTimeout(1000);
  }

  // Find all links under it by checking visibility of links after expanding
  const links = await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(el => el.innerText.trim()).filter(t => t.length > 0));
  console.log('Available links:', links);
  
  await browser.close();
})();
