const { chromium } = require('playwright');
require('dotenv').config({ path: '.env.dev' });
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page = await context.newPage();
  
  await page.goto(process.env.BASE_URL + '/web/dashboard/Transactions');
  
  await page.waitForTimeout(5000); // let transactions load
  
  // Dump all tabs
  const tabs = await page.$$eval('[role="tab"]', elements => 
    elements.map(el => ({
      tagName: el.tagName,
      text: el.innerText.trim()
    }))
  );
  
  // Dump all buttons
  const buttons = await page.$$eval('button', elements => 
    elements.map(el => ({
      text: el.innerText.trim(),
      classes: el.className
    })).filter(b => b.text)
  );

  // Dump all inputs
  const inputs = await page.$$eval('input', elements =>
    elements.map(el => ({
      type: el.type,
      placeholder: el.placeholder,
      name: el.name,
      id: el.id,
      classes: el.className
    }))
  );

  fs.writeFileSync('transactions-dom.json', JSON.stringify({ tabs, buttons, inputs }, null, 2));
  await browser.close();
})();
