class Filters {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.filterButton = page.getByText(/^Filters?\d*$/i).first();
    this.applyButton = page.getByRole('button', { name: /Apply/i }).first();
    this.clearAllButton = page.getByRole('button', { name: /Clear All/i }).first();
    this.confirmButton = page.getByRole('button', { name: /Confirm/i }).first();
  }

  async open() {
    if (await this.filterButton.isVisible()) {
      await this.filterButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async apply() {
    if (await this.confirmButton.isVisible() && await this.confirmButton.isEnabled()) {
      await this.confirmButton.click();
    }
    if (await this.applyButton.isVisible()) {
      if (await this.applyButton.isEnabled()) {
        await this.applyButton.click();
      } else {
        await this.page.keyboard.press('Escape');
      }
    }
    await this.page.waitForTimeout(1000);
  }

  async clearAll() {
    await this.open();
    if (await this.clearAllButton.isVisible()) {
      await this.clearAllButton.click();
      await this.page.waitForTimeout(500);
    }
    await this.apply();
  }

  async selectOption(optionText) {
    const option = this.page.locator(`text="${optionText}"`).first();
    if (await option.isVisible()) {
        await option.click();
        await this.page.waitForTimeout(500);
    }
  }

  async selectExactOption(optionText) {
    const option = this.page.getByText(optionText, { exact: true }).first();
    if (await option.isVisible()) {
        await option.click();
        await this.page.waitForTimeout(500);
    }
  }
}

module.exports = { Filters };
