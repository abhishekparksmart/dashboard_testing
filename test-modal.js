const { chromium } = require('playwright');
require('dotenv').config({ path: '.env.dev' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page = await context.newPage();
  
  await page.goto(process.env.BASE_URL + '/web/dashboard/AccessPasses');
  await page.waitForTimeout(3000);
  
  await page.getByRole('button', { name: 'Issue Access Pass' }).click();
  await page.waitForTimeout(2000);
  
  const text = await page.$eval('.MuiDialog-root, [role="dialog"], .modal', el => el.innerText).catch(() => 'No modal found');
  console.log('--- Modal Text ---');
  console.log(text);
  
  const comboboxes = await page.$$eval('[role="combobox"], select', elements => elements.map(el => el.innerText));
  console.log('--- Comboboxes ---');
  console.log(comboboxes);
  
  await browser.close();
})();
