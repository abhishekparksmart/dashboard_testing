const { chromium } = require('@playwright/test');
const { Env } = require('./env');
const { LoginPage } = require('../pages/LoginPage');
const path = require('path');

async function globalSetup(config) {
  Env.load();
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const loginPage = new LoginPage(page);
  
  try {
    console.log(`[Global Setup] Authenticating as Admin...`);
    await loginPage.navigate();
    await loginPage.login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
    
    // Explicitly wait for navigation to dashboard or site selection to ensure cookie is set
    await page.waitForURL(/.*(dashboard|SiteSelection).*/, { timeout: 15000 });
    
    // Select Site if needed
    if (await page.getByRole('heading', { name: 'No Site Selected' }).isVisible({ timeout: 5000 }).catch(() => false)) {
        await loginPage.selectSite('ParkSmart');
    }

    const storagePath = path.resolve(__dirname, '../.auth/admin.json');
    await context.storageState({ path: storagePath });
    console.log(`[Global Setup] State saved to ${storagePath}`);
    
  } catch (error) {
    console.error('[Global Setup] Authentication failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = globalSetup;
