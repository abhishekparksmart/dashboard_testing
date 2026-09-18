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

  // Get ALL anchor href attributes from the page
  const allLinks = await page.evaluate(() => {
    return [...document.querySelectorAll('a[href]')].map(a => ({
      text: a.textContent.trim().substring(0, 30),
      href: a.getAttribute('href')
    })).filter(l => l.href && l.href.includes('dashboard'));
  });
  
  console.log('All dashboard links found:');
  allLinks.forEach(l => console.log(`  "${l.text}" -> ${l.href}`));

  await browser.close();
})();
