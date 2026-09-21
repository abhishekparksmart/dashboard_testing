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

  const mgmtBtn = page.getByRole('button', { name: /Site Manage/i }).first();
  if (await mgmtBtn.isVisible()) {
    const expanded = await mgmtBtn.getAttribute('aria-expanded');
    if (expanded !== 'true') await mgmtBtn.click();
    await page.waitForTimeout(1000);
  }

  const link = page.getByRole('link', { name: 'Sites', exact: true }).first();
  await link.click();
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  await page.waitForTimeout(2000);

  const headings = await page.evaluate(() => Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(el => el.innerText));
  const buttons = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(el => el.innerText.trim()).filter(t => t.length > 0));
  
  console.log('Headings:', headings);
  console.log('Buttons:', buttons);
  
  await browser.close();
})();
