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

  // Get all sidebar items
  const sidebarNav = page.locator('nav').first();
  // Sometimes sidebar is not a <nav>. Let's just find elements with hrefs inside the sidebar container,
  // or just all links that are likely sidebar items.
  const links = await page.evaluate(() => {
    const aside = document.querySelector('aside') || document.querySelector('.sidebar') || document.querySelector('[class*="Sidebar"]');
    if (!aside) return [];
    const linkEls = Array.from(aside.querySelectorAll('a, button[aria-expanded]'));
    return linkEls.map(el => {
      return {
        text: el.innerText.trim(),
        tag: el.tagName.toLowerCase(),
        href: el.getAttribute('href'),
        isExpandable: el.hasAttribute('aria-expanded')
      };
    }).filter(item => item.text !== '');
  });

  console.log(JSON.stringify(links, null, 2));
  await browser.close();
})();
