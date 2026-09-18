const { Sidebar } = require('../components/Sidebar');
const { Table } = require('../components/Table');

exports.AccessPassTypesPage = class AccessPassTypesPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.sidebar = new Sidebar(page);
    this.table = new Table(page);
    
    this.createBtn = page.getByRole('button', { name: /Create Access Pass Type/i });
    this.searchInput = page.getByPlaceholder(/Search by/i);
    this.searchApplyBtn = page.getByRole('button', { name: 'Apply' });
  }

  // Navigation
  async navigate() {
    const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
    const currentUrl = this.page.url();
    if (!currentUrl.includes(baseUrl)) {
      await this.page.goto(`${baseUrl}/web/dashboard`);
      await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    }
    if (/\/web\/dashboard\/AccessPassTypes/.test(this.page.url())) {
      return;
    }
    const mgmtBtn = this.page.getByRole('button', { name: /Access Manage/i }).first();
    if (await mgmtBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const expanded = await mgmtBtn.getAttribute('aria-expanded');
      if (expanded !== 'true') await mgmtBtn.click();
    }
    const link = this.page.getByRole('link', { name: /Access Pass Types/i }).first();
    await link.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.page.waitForTimeout(1000);
  }

  // Actions
  async searchByName(name) {
    await this.searchInput.fill(name);
    if (await this.searchApplyBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.searchApplyBtn.click();
    } else {
      await this.searchInput.press('Enter');
    }
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
  }

  async openCreateForm() {
    await this.createBtn.click();
    await this.page.waitForTimeout(1000);
  }
};
