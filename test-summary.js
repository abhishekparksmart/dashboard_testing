const { chromium } = require('playwright');
require('dotenv').config({ path: '.env.dev' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page = await context.newPage();
  
  await page.goto(process.env.BASE_URL + '/web/dashboard/Transactions');
  await page.waitForTimeout(3000);
  
  await page.getByText('Summary', { exact: true }).click();
  await page.waitForTimeout(2000);
  
  const text = await page.$eval('body', el => el.innerText);
  console.log('--- Summary Tab Body Text ---');
  console.log(text.slice(0, 1000));
  
  await browser.close();
})();
