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

  async function expandAndLog(btnRegex, name) {
    const btn = page.getByRole('button', { name: btnRegex }).first();
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      const expanded = await btn.getAttribute('aria-expanded');
      if (expanded !== 'true') await btn.click();
      await page.waitForTimeout(500);
    }
  }

  await expandAndLog(/Visitor Manage/i, 'Visitor');
  await expandAndLog(/Inventory/i, 'Inventory');
  await expandAndLog(/Valet Manage/i, 'Valet');
  await expandAndLog(/Violations/i, 'Violations');

  // get all links
  const links = await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(el => el.innerText.trim()).filter(t => t.length > 0));
  console.log('Available links:', links);
  
  await browser.close();
})();
