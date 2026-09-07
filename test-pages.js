const { chromium } = require('playwright');
require('dotenv').config({ path: '.env.dev' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page = await context.newPage();
  
  // 1. Check Access Passes Page
  await page.goto(process.env.BASE_URL + '/web/dashboard/AccessPasses');
  await page.waitForTimeout(5000);
  const buttonsAccess = await page.$$eval('button', elements => elements.map(el => el.innerText.trim()).filter(t => t));
  console.log('--- Access Passes Page Buttons ---');
  console.log(buttonsAccess.join(', '));
  
  // 2. Check Transactions Page
  await page.goto(process.env.BASE_URL + '/web/dashboard/Transactions');
  await page.waitForTimeout(5000);
  const tables = await page.$$eval('table', elements => elements.length);
  console.log('--- Transactions Page ---');
  console.log('Table count:', tables);
  
  // Dump text of Transactions to see what it says
  const bodyText = await page.$eval('body', el => el.innerText.slice(0, 500));
  console.log('Body Text Snippet:', bodyText);
  
  await browser.close();
})();
