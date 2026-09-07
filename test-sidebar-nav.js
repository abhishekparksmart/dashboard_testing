const { chromium } = require('playwright');
require('dotenv').config({ path: '.env.dev' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: '.auth/admin.json' });
  const page = await context.newPage();
  
  await page.goto(process.env.BASE_URL + '/web/dashboard');
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL before navigation:', page.url());
  
  // Try to find Access Management
  const menuButton = page.getByRole('button', { name: /Access Management/i }).first();
  const count = await menuButton.count();
  console.log('Access Management button count:', count);
  
  if (count > 0) {
    console.log('Is Visible?', await menuButton.isVisible());
    console.log('aria-expanded:', await menuButton.getAttribute('aria-expanded'));
    await menuButton.click();
    await page.waitForTimeout(1000);
  }
  
  // Try to find Access Passes link
  const menuLink = page.getByRole('link', { name: /Access Passes/i }).first();
  const linkCount = await menuLink.count();
  console.log('Access Passes link count:', linkCount);
  
  if (linkCount > 0) {
    console.log('Is Link Visible?', await menuLink.isVisible());
    await menuLink.click();
    await page.waitForTimeout(2000);
    console.log('URL after clicking link:', page.url());
  }

  await browser.close();
})();
