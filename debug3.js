const { chromium } = require('@playwright/test');
const { Env } = require('./config/env');
const { ParkSmartLogsPage } = require('./pages/ParkSmartLogsPage');

(async () => {
  Env.load();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page    = await context.newPage();

  const logsPage = new ParkSmartLogsPage(page);
  await logsPage.navigate();
  await logsPage.goToLogsTab();

  const ths = await page.evaluate(() => Array.from(document.querySelectorAll('th')).map(th => th.textContent.trim()));
  console.log('TH headers:', ths);
  
  const headers = await logsPage.getColumnHeaders();
  console.log('getColumnHeaders:', headers);

  await browser.close();
})();
