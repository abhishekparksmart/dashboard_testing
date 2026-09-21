const { Sidebar } = require('../components/Sidebar');
const { Table } = require('../components/Table');

exports.VisitsPage = class VisitsPage {
  constructor(page) {
    this.page = page;
    this.sidebar = new Sidebar(page);
    this.table = new Table(page);
    this.createBtn = page.getByRole('button', { name: /Create Visit/i });
    this.searchInput = page.getByPlaceholder(/Search by/i);
    this.searchApplyBtn = page.getByRole('button', { name: 'Apply' });
  }

  async navigate() {
    await this.page.goto(`${process.env.BASE_URL || 'https://web.parksmart.io'}/web/dashboard/Visits`);
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async searchByName(name) {
    await this.searchInput.fill(name);
    if (await this.searchApplyBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.searchApplyBtn.click();
    } else {
      await this.searchInput.press('Enter');
    }
    await this.page.waitForTimeout(2000);
  }

  async openCreateForm() {
    await this.createBtn.click();
    await this.page.waitForTimeout(1000);
  }
};
