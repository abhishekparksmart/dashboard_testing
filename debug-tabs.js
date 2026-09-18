const { chromium } = require('@playwright/test');
const { Env } = require('./config/env');

(async () => {
  Env.load();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page    = await context.newPage();

  const base = process.env.BASE_URL || 'https://web.parksmart.io';
  await page.goto(`${base}/web/dashboard`);
  await page.waitForLoadState('networkidle', { timeout: 20000 });

  // Click Parking Logs sidebar link
  const link = page.getByRole('link', { name: 'Parking Logs' }).first();
  await link.click();
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  await page.waitForTimeout(2000);

  console.log('Current URL:', page.url());

  // Dump all elements that contain 'Logs' or 'Summary' text
  const results = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const found = [];
    for (const el of elements) {
      const text = el.textContent.trim();
      if ((text === 'Logs' || text === 'Summary') && el.children.length === 0) {
        found.push({
          tag: el.tagName,
          role: el.getAttribute('role'),
          class: el.className.substring(0, 80),
          text: text,
          href: el.href || null,
          ariaSelected: el.getAttribute('aria-selected'),
          id: el.id,
        });
      }
    }
    return found;
  });

  console.log('Tab-like elements found:');
  results.forEach(r => console.log(JSON.stringify(r)));

  await browser.close();
})();
