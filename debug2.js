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

  console.log('Original count:', await logsPage.readLogsCount());

  console.log('Searching...');
  await logsPage.searchInput.click();
  await logsPage.searchInput.clear();
  await logsPage.searchInput.fill('ZZZZZZZZZZZ99999');
  
  await logsPage.applyBtn.click(); // Click Apply instead of Enter

  await page.waitForTimeout(2000);
  console.log('Searched count:', await logsPage.readLogsCount());
  console.log('Is empty?', await logsPage.isEmptyState());

  await browser.close();
})();
