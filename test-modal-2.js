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
  
  // Select Pass Type
  await page.getByRole('combobox').filter({ hasText: 'Select Pass Type' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('option').first().click(); // click first option (e.g. Visitor)
  await page.waitForTimeout(2000);
  
  const comboboxes = await page.$$eval('[role="combobox"], select', elements => elements.map(el => el.innerText));
  console.log('--- Comboboxes After Pass Type Selection ---');
  console.log(comboboxes);
  
  const text = await page.$eval('body', el => el.innerText.slice(0, 1000));
  console.log('--- Body Text Snippet ---');
  console.log(text);
  
  await browser.close();
})();
