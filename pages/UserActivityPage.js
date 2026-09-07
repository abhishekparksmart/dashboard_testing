exports.UserActivityPage = class UserActivityPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Based on the grep search, there's a link or button called "User Activity"
    this.userActivityNav = page.getByRole('link', { name: 'User Activity', exact: true }).first();
    
    // Generic locators for the page content
    this.tableRows = page.getByRole('row');
    this.tableHeader = page.getByRole('row').first();
    this.emptyStateMessage = page.getByText(/No Data|No results found|0 records/i).first();
    
    // Filters and Date pickers available on the page
    this.filtersButton = page.getByText('Filters', { exact: true });
    this.applyButton = page.getByRole('button', { name: 'Apply' });
  }

  async navigateToUserActivity() {
    // We try to click the navigation link, but fallback to direct navigation if it's hidden or blocked
    try {
      await this.userActivityNav.click({ timeout: 5000 });
      await this.page.waitForURL('**/UserActivity', { timeout: 10000 });
    } catch (e) {
      console.log('Direct click on nav failed, falling back to page.goto');
      await this.page.goto('https://parksmart.io/web/dashboard/UserActivity');
    }
    // Wait for the main page to load
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Helper to open filters
   */
  async openFilters() {
    await this.filtersButton.click();
  }
};
