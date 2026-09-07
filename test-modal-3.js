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
  await page.getByRole('option').first().click(); 
  await page.waitForTimeout(2000);
  
  const text = await page.$eval('body', el => el.innerText);
  console.log('--- Full Body Text ---');
  console.log(text.slice(0, 3000));
  
  await browser.close();
})();
