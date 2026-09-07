const { Sidebar } = require('../components/Sidebar');
const { Table } = require('../components/Table');

exports.ValetDriverPage = class ValetDriverPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.sidebar = new Sidebar(page);
    this.table = new Table(page);
    
    // Locators
    this.searchDropdown = page.locator('[role="combobox"]').filter({ hasText: /Name|Mobile Number/i }).first();
    this.searchInput = page.getByPlaceholder('Search by');
    this.applyButton = page.getByRole('button', { name: 'Apply' });
    this.siteCombobox = page.locator('main').getByRole('combobox').first();
    this.updateDriverButton = page.getByRole('button', { name: 'Update Valet Driver' });
  }

  // Navigation
  async navigateToValetDrivers() {
    const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
    await this.page.goto(`${baseUrl}/web/dashboard/ValetDrivers`);
    await this.page.waitForLoadState('networkidle');
  }

  // Actions
  async searchBy(value, filterType) {
    await this.searchDropdown.click(); 
    await this.page.getByRole('option', { name: filterType, exact: true }).click();

    await this.searchInput.click();
    await this.searchInput.fill(value);
    await this.applyButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async updateDriverSite(mobileNumber, newSiteName) {
    const row = await this.table.getRowByText(mobileNumber);
    await row.getByRole('button').first().click();
    
    await this.page.waitForURL(/.*ValetDrivers\/Edit.*/);
    await this.page.waitForTimeout(1000);
    
    await this.siteCombobox.click(); 
    
    await this.page.keyboard.type(newSiteName);
    await this.page.waitForTimeout(1000);
    
    const option = this.page.getByRole('option', { name: new RegExp(newSiteName, 'i') }).first();
    if (await option.isVisible().catch(() => false)) {
        await option.click();
    } else {
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
    }
    
    if (await this.updateDriverButton.count() > 1) {
      await this.updateDriverButton.nth(1).click();
    } else {
      await this.updateDriverButton.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  // Validations
  async isDriverVisible(mobileNumber) {
    const row = await this.table.getRowByText(mobileNumber);
    try {
      await row.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
};
