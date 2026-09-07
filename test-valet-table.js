const { chromium } = require('playwright');
require('dotenv').config({ path: '.env.dev' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page = await context.newPage();
  
  await page.goto(process.env.BASE_URL + '/web/dashboard/ValetDrivers');
  await page.waitForTimeout(3000);
  
  const combobox = page.locator('[role="combobox"]').filter({ hasText: /Name|Mobile Number/i }).first();
  await combobox.click();
  await page.waitForTimeout(1000);
  
  await page.getByRole('option', { name: 'Mobile Number', exact: true }).click();
  await page.waitForTimeout(1000);
  
  await page.getByPlaceholder('Search by').fill('8953675413');
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.waitForTimeout(3000);
  
  const rows = await page.$$eval('tr', elements => elements.map(el => el.innerText));
  console.log('--- Table Rows ---');
  console.log(rows);
  
  await browser.close();
})();
