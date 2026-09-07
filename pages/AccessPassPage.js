const { Sidebar } = require('../components/Sidebar');
const { Filters } = require('../components/Filters');
const { Table } = require('../components/Table');

exports.AccessPassPage = class AccessPassPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.sidebar = new Sidebar(page);
    this.filters = new Filters(page);
    this.table = new Table(page);
    
    this.createAccessPassButton = page.getByRole('button', { name: 'Issue Access Pass' });
    this.submitCreatePassButton = page.getByText('Issue Pass', { exact: true }).last();
    this.addVehicleButton = page.getByRole('button', { name: 'Add Vehicle' });
  }

  // Navigation
  async navigateToAccessPasses() {
    const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
    await this.page.goto(`${baseUrl}/web/dashboard/AccessPasses`);
    await this.page.waitForLoadState('networkidle');
  }

  // Actions
  async openCreateAccessPassModal() {
    await this.createAccessPassButton.click();
    await this.page.waitForTimeout(500);
  }

  async fillAccessPassDetails({ passType, name, mobile, email, additionalInfo, gender }) {
    // 1. Select Pass Type
    const passTypeCombo = this.page.getByRole('combobox').filter({ hasText: /Select Pass Type|Select Access Pass Type/i });
    if (await passTypeCombo.isVisible()) {
      await passTypeCombo.click();
      await this.page.waitForTimeout(500);
      
      // Try to select the specific pass type, otherwise just pick the first available
      const option = this.page.getByRole('option', { name: passType, exact: true });
      if (await option.isVisible()) {
        await option.click();
      } else {
        await this.page.getByRole('option').first().click();
      }
    }
    
    await this.page.getByRole('textbox', { name: /Pass Holder Name/i }).fill(name);
    
    if (email) {
      await this.page.getByRole('textbox', { name: 'Email Id' }).fill(email);
    }
    if (additionalInfo) {
      await this.page.getByRole('textbox', { name: 'Additional Information' }).fill(additionalInfo);
    }
    if (gender) {
      await this.page.getByRole('combobox').filter({ hasText: 'Select Gender' }).click();
      await this.page.getByText(gender, { exact: true }).click();
    }
  }

  async addVehicle({ type, number, identificationMode }) {
    await this.addVehicleButton.first().click();
    
    await this.page.getByRole('combobox').first().click(); // Usually the first is type
    await this.page.getByText(type).click();
    
    await this.page.getByRole('textbox', { name: 'Vehicle Number *' }).fill(number);
    
    await this.page.getByRole('combobox').filter({ hasText: 'Select Identification Mode' }).click();
    await this.page.getByRole('option', { name: identificationMode }).click();
    
    await this.addVehicleButton.last().click(); // Assuming second button saves it
    await this.page.waitForTimeout(500);
  }

  async submitCreatePass() {
    await this.submitCreatePassButton.last().click();
    await this.page.waitForLoadState('networkidle');
  }
};
