const { Sidebar } = require('../components/Sidebar');
const { Table } = require('../components/Table');
const { Pagination } = require('../components/Pagination');
const { Search } = require('../components/Search');
const { Filters } = require('../components/Filters');
const { ROUTES } = require('../constants/routes');

exports.TransactionsPage = class TransactionsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Components
    this.sidebar = new Sidebar(page);
    this.table = new Table(page);
    this.pagination = new Pagination(page);
    this.search = new Search(page);
    this.filters = new Filters(page);
    
    // Page specific locators
    this.visitorTab = page.getByText('Visitor', { exact: true });
    this.accessPassTab = page.getByText('Access Pass', { exact: true });
    this.summaryTab = page.getByText('Summary', { exact: true });
    this.summaryKpiCards = page.locator('.kpi-card, .summary-card, [class*="MuiCard-root"], div.bg-white.shadow').first();
  }

  // Navigation Actions
  async navigateToTransactions() {
    const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
    await this.page.goto(`${baseUrl}/web/dashboard/Transactions`);
    await this.page.waitForLoadState('networkidle');
  }

  async goToVisitorTab() {
    await this.visitorTab.click();
    await this.page.waitForTimeout(500);
  }

  async goToAccessPassTab() {
    await this.accessPassTab.click();
    await this.page.waitForTimeout(500);
  }

  async goToSummaryTab() {
    await this.summaryTab.click();
    await this.page.waitForTimeout(500);
  }

  // Filter Actions
  async applyStatusFilter(status) {
    await this.filters.open();
    await this.filters.selectOption(status);
    await this.filters.apply();
  }

  async applyDateFilter(dateText) {
    await this.filters.open();
    await this.filters.selectExactOption(dateText);
    await this.filters.apply();
  }

  async clearFilters() {
    await this.filters.clearAll();
  }

  // Search Actions
  async searchBy(text) {
    await this.search.searchBy(text);
  }

  // Pagination Actions
  async nextPage() {
    await this.pagination.nextPage();
  }

  async changeRowsPerPage(rows) {
    await this.pagination.changeRowsPerPage(rows);
  }

  // Table Actions
  async clickColumnSort(columnName) {
    await this.table.clickColumnSort(columnName);
  }

  // Validations / State queries
  async getTableRowCount() {
    return await this.table.getRowCount();
  }
};
