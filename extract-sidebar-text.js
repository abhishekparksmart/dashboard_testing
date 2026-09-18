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

  // Let's get all links and buttons on the left side of the screen
  const links = await page.evaluate(() => {
    // Usually sidebar is the first div or fixed container on the left.
    // Let's just grab all visible links and buttons in the document
    const items = Array.from(document.querySelectorAll('a, button'));
    return items.map(el => el.innerText.trim()).filter(t => t.length > 2);
  });

  // print unique ones
  console.log(Array.from(new Set(links)));
  await browser.close();
})();
