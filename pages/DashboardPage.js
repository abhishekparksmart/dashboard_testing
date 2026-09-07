exports.DashboardPage = class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Common Dashboard locators (Generic structure for customization)
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
    this.dateRangePicker = page.getByRole('button', { name: /Select Date|Today|Last 7 Days/i }).first();
    
    // KPI Cards - Targeting by generic text, assuming cards contain these labels
    this.totalRevenueKpi = page.locator('div').filter({ hasText: 'Total Revenue' }).last();
    this.totalVehiclesKpi = page.locator('div').filter({ hasText: 'Total Vehicles' }).last();
    this.activeParkingKpi = page.locator('div').filter({ hasText: 'Active Parking' }).last();
    
    // Charts
    this.revenueChart = page.locator('canvas, .recharts-wrapper').first(); // Common chart libraries generate canvas or recharts-wrapper
    this.occupancyChart = page.locator('canvas, .recharts-wrapper').nth(1);

    // Refresh Button
    this.refreshDataButton = page.getByRole('button', { name: 'Refresh' });
  }

  /**
   * Select a predefined date range from the dashboard filter
   * @param {string} rangeName - e.g., 'Today', 'Last 7 Days', 'This Month'
   */
  async selectDateRange(rangeName) {
    await this.dateRangePicker.click();
    await this.page.getByRole('menuitem', { name: rangeName }).click();
  }

  /**
   * Wait for the dashboard to fully load its data
   */
  async waitForDashboardToLoad() {
    // Wait for the main chart or a specific KPI to become visible
    await this.revenueChart.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    // Alternatively wait for network idle if charts fetch data
    // await this.page.waitForLoadState('networkidle');
  }

  /**
   * Extracts the numeric value from a KPI card
   * @param {import('@playwright/test').Locator} kpiLocator 
   * @returns {Promise<string>}
   */
  async getKpiValue(kpiLocator) {
    // Assumes the value is prominently displayed inside an element with a specific class or tag
    // Adjust '.value' or 'h3' to match your actual DOM
    const valueLocator = kpiLocator.locator('h3, h2, .text-2xl, .value').first();
    return await valueLocator.textContent();
  }
};
