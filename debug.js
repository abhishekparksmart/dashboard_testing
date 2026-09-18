const { chromium } = require('@playwright/test');
const { Env } = require('./config/env');
const { ParkSmartLogsPage } = require('./pages/ParkSmartLogsPage');
const fs = require('fs');

(async () => {
  Env.load();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page    = await context.newPage();

  const logsPage = new ParkSmartLogsPage(page);
  await logsPage.navigate();
  await logsPage.goToLogsTab();

  console.log('Searching...');
  await logsPage.searchInput.click();
  await logsPage.searchInput.clear();
  await logsPage.searchInput.fill('ZZZZZZZZZZZ99999');
  
  // Wait to see what happens
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'search-before-enter.png' });
  
  // Is there a search button?
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim() || b.className);
  });
  console.log('Buttons:', buttons);
  
  await browser.close();
})();
