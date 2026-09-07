const { chromium } = require('playwright');
require('dotenv').config({ path: '.env.dev' });

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page = await context.newPage();
  
  await page.goto(process.env.BASE_URL + '/web/dashboard/Transactions');
  await page.waitForTimeout(5000); // let transactions load
  
  const tables = await page.$$eval('table', elements => elements.length);
  const grids = await page.$$eval('[role="grid"]', elements => elements.length);
  const headers = await page.$$eval('h1, h2, h3, h4, h5, h6', elements => elements.map(e => e.innerText));
  
  console.log(`Tables: ${tables}, Grids: ${grids}`);
  console.log(`Headers: ${headers.join(', ')}`);
  
  await browser.close();
})();
