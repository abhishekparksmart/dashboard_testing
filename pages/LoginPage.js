const { ROUTES } = require('../constants/routes');

exports.LoginPage = class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: /Email|Username/i }).or(page.getByPlaceholder(/email|username/i));
    this.passwordInput = page.getByRole('textbox', { name: /Password/i }).or(page.locator('input[type="password"]'));
    this.loginButton = page.getByRole('button', { name: /Sign in|Log in|Login/i });
    this.siteNameCombobox = page.getByRole('combobox').filter({ hasText: 'Site Name' });
    this.userMenuButton = page.locator('button:has(img[alt*="avatar"]), button.user-menu'); // Generic user menu
    this.logoutMenuItem = page.getByRole('menuitem', { name: /Log out/i });
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"], .toast').first();
  }

  // Navigation
  async navigate() {
    const baseUrl = process.env.BASE_URL || 'https://parksmart.in';
    await this.page.goto(`${baseUrl}${ROUTES.LOGIN}`);
  }

  // Actions
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectSite(siteName) {
    await this.siteNameCombobox.click();
    await this.page.getByPlaceholder('Search...').fill(siteName);
    await this.page.getByRole('option', { name: siteName, exact: true }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async logout() {
    await this.userMenuButton.click();
    await this.logoutMenuItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Validations
  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
};
