class Search {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByRole('textbox').filter({ hasText: '' }).first();
    this.exactSearchInput = page.getByPlaceholder(/Search|Mobile|Name/i).first();
    this.applyButton = page.getByRole('button', { name: 'Apply' }).first();
  }

  async searchBy(text) {
    const inputToUse = (await this.exactSearchInput.isVisible()) ? this.exactSearchInput : this.searchInput;
    
    if (await inputToUse.isVisible()) {
      await inputToUse.fill(text);
      await inputToUse.press('Enter');
      
      if (await this.applyButton.isVisible() && await this.applyButton.isEnabled()) {
        await this.applyButton.click();
      }
      
      await this.page.waitForTimeout(3000); // Wait for results
    }
  }
}

module.exports = { Search };
