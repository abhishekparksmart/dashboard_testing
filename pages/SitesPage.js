const { Sidebar } = require('../components/Sidebar');
const { Table } = require('../components/Table');

exports.SitesPage = class SitesPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.sidebar = new Sidebar(page);
    this.table = new Table(page);
    
    this.createBtn = page.getByRole('button', { name: /Create Site/i });
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
    
    // Check if already on Sites page
    if (/\/web\/dashboard\/Sites/.test(this.page.url())) {
      return;
    }

    // Expand Site Management
    const mgmtBtn = this.page.getByRole('button', { name: /Site Manage/i }).first();
    if (await mgmtBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const expanded = await mgmtBtn.getAttribute('aria-expanded');
      if (expanded !== 'true') await mgmtBtn.click();
    }

    // Click Sites
    const link = this.page.getByRole('link', { name: 'Sites', exact: true }).first();
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
