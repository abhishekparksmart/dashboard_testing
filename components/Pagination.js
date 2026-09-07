class Pagination {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.nextButton = page.locator('button[aria-label="Go to next page"], button[title="Next Page"]').first();
    this.prevButton = page.locator('button[aria-label="Go to previous page"], button[title="Previous Page"]').first();
    this.rowsDropdown = page.locator('div[class*="select"], [aria-haspopup="listbox"]').filter({ hasText: /10|25|50|100/ }).first();
  }

  async nextPage() {
    if (await this.nextButton.isVisible() && await this.nextButton.isEnabled()) {
      await this.nextButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async prevPage() {
    if (await this.prevButton.isVisible() && await this.prevButton.isEnabled()) {
      await this.prevButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async changeRowsPerPage(rows) {
    if (await this.rowsDropdown.isVisible()) {
      await this.rowsDropdown.click();
      await this.page.getByRole('option', { name: String(rows) }).first().click();
      await this.page.waitForTimeout(500);
    }
  }
}

module.exports = { Pagination };
