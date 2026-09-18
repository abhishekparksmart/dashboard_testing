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

  // Open Access Management accordion if not open
  const mgmtBtn = page.getByRole('button', { name: /Access Manage/i }).first();
  if (await mgmtBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    const expanded = await mgmtBtn.getAttribute('aria-expanded');
    if (expanded !== 'true') await mgmtBtn.click();
  }

  // Click Access Pass Types
  const link = page.getByRole('link', { name: /Access Pass Types/i }).first();
  await link.click();
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  await page.waitForTimeout(2000);

  console.log('URL:', page.url());

  // Take screenshot
  await page.screenshot({ path: 'access-pass-types.png' });

  // Extract headings and buttons
  const headings = await page.evaluate(() => Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(el => el.innerText));
  console.log('Headings:', headings);

  const buttons = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(el => el.innerText.trim()).filter(t => t.length > 0));
  console.log('Buttons:', buttons);

  await browser.close();
})();
