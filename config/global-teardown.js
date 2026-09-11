const { chromium } = require('@playwright/test');
const { Env } = require('./env');
const { LoginPage } = require('../pages/LoginPage');
const path = require('path');

async function globalTeardown() {
  Env.load();

  const storagePath = path.resolve(__dirname, '../.auth/admin.json');
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: storagePath });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  try {
    await page.goto(`${process.env.BASE_URL}/web/dashboard`);
    await page.waitForLoadState('networkidle');
    await loginPage.logout();
    console.log('[Global Teardown] Logged out Admin session.');
  } finally {
    await browser.close();
  }
}

module.exports = globalTeardown;
