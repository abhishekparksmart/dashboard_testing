const { chromium } = require('playwright');
require('dotenv').config({ path: '.env.dev' });
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page = await context.newPage();
  
  await page.goto(process.env.BASE_URL + '/web/dashboard');
  
  await page.waitForTimeout(5000); // let dashboard load
  
  // Dump all links and buttons text in the sidebar
  const items = await page.$$eval('button, a', elements => 
    elements.map(el => ({
      tagName: el.tagName,
      text: el.innerText.trim(),
      role: el.getAttribute('role'),
      href: el.getAttribute('href')
    })).filter(item => item.text.length > 0)
  );
  
  fs.writeFileSync('sidebar-dump.json', JSON.stringify(items, null, 2));
  await browser.close();
})();
