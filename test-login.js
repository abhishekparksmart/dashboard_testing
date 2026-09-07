const { chromium } = require('playwright');
require('dotenv').config({ path: '.env.dev' });

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to login...');
  await page.goto(process.env.BASE_URL + '/web/auth/login');
  
  console.log('Filling username...');
  const usernameInput = page.getByRole('textbox', { name: /Email|Username/i }).or(page.getByPlaceholder(/email|username/i));
  await usernameInput.fill(process.env.ADMIN_USERNAME);
  
  console.log('Filling password...');
  const passwordInput = page.getByRole('textbox', { name: /Password/i }).or(page.locator('input[type="password"]'));
  await passwordInput.fill(process.env.ADMIN_PASSWORD);
  
  console.log('Clicking login...');
  const loginButton = page.getByRole('button', { name: /Sign in|Log in|Login/i });
  await loginButton.click();
  
  console.log('Waiting for network idle...');
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL: ', page.url());
  await browser.close();
})();
