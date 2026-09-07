const { chromium } = require('playwright');
require('dotenv').config({ path: '.env.dev' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page = await context.newPage();
  
  await page.goto(process.env.BASE_URL + '/web/dashboard/ValetDrivers');
  await page.waitForTimeout(5000);
  
  const inputs = await page.$$eval('input, textarea', elements => elements.map(el => ({
    type: el.type,
    placeholder: el.placeholder,
    name: el.name,
    id: el.id
  })));
  
  const comboboxes = await page.$$eval('[role="combobox"], select', elements => elements.map(el => ({
    text: el.innerText,
    classes: el.className
  })));
  
  console.log('--- Inputs ---');
  console.log(inputs);
  
  console.log('--- Comboboxes ---');
  console.log(comboboxes);
  
  await browser.close();
})();
