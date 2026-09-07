class Table {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('@playwright/test').Locator} container
   */
  constructor(page, container = page.locator('table').first()) {
    this.page = page;
    this.container = container;
    this.rows = this.container.locator('tbody tr');
    this.headers = this.container.locator('thead th');
  }

  async getRowCount() {
    return await this.rows.count();
  }

  async clickColumnSort(columnName) {
    const header = this.page.getByRole('columnheader', { name: columnName }).first();
    if (await header.isVisible()) {
      await header.click();
      await this.page.waitForTimeout(500); // Wait for sort to apply
    }
  }

  async getRowByText(text) {
    return this.rows.filter({ hasText: text }).first();
  }

  async isDataVisible() {
    const count = await this.getRowCount();
    return count > 0;
  }
}

module.exports = { Table };
