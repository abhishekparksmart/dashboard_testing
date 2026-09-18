const { chromium } = require('@playwright/test');
const { Env } = require('./config/env');
const { AccessPassPage } = require('./pages/AccessPassPage');

(async () => {
  Env.load();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page    = await context.newPage();
  
  const base = process.env.BASE_URL || 'https://web.parksmart.io';
  await page.goto(`${base}/web/dashboard`);
  await page.waitForLoadState('networkidle', { timeout: 20000 });

  const mgmtBtn = page.getByRole('button', { name: /Access Manage/i }).first();
  if (await mgmtBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    const expanded = await mgmtBtn.getAttribute('aria-expanded');
    if (expanded !== 'true') await mgmtBtn.click();
  }
  const link = page.getByRole('link', { name: /Access Pass/i }).first();
  await link.click();
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  await page.waitForTimeout(2000);

  const btn = page.getByRole('button', { name: /Issue Access Pass/i }).first();
  await btn.click();
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'ap-after-click.png' });
  await browser.close();
})();
