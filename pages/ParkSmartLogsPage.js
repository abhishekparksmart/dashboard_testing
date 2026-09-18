'use strict';

/**
 * Page Object for the ParkSmart Parking Logs page.
 * URL: /web/dashboard/Logs  (sidebar link navigates here)
 *
 * Layout:
 *  - Two tabs: role="tab" BUTTON elements: "Logs" | "Summary"
 *    IDs: radix-*-trigger-logs, radix-*-trigger-summary
 *  - Logs tab:  Filters button, table (Vehicle, User, Direction, Type, Time, Amount, Gate, Mode, Operator), pagination "X - Y of Z"
 *  - Summary tab: KPI cards (Entered, Exited, Not- Exited, Amount)
 */
exports.ParkSmartLogsPage = class ParkSmartLogsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Tabs are <button role="tab"> elements (Radix UI Tabs component)
    this.summaryTab = page.getByRole('tab', { name: 'Summary' });
    this.logsTab    = page.getByRole('tab', { name: 'Logs' });

    // Logs tab locators
    this.paginationInfo = page.getByText(/\d+\s*-\s*\d+\s+of\s+\d+/i).first();
    this.tableRows      = page.getByRole('row');
    this.tableHeaders   = page.locator('th');
    this.searchInput    = page.getByPlaceholder(/Search/i).first();
    this.noDataMsg      = page.getByText(/No Data|No results|No records/i).first();

    // Filter panel
    this.filterButton = page.getByText(/^Filters\d*$/).first();
    this.confirmBtn   = page.getByRole('button', { name: 'Confirm' });
    this.applyBtn     = page.getByRole('button', { name: 'Apply' });
    this.clearAllBtn  = page.getByRole('button', { name: 'Clear All' });
  }

  // -- Navigation ------------------------------------------------------------

  /**
   * Navigate to Parking Logs via the sidebar link.
   * The sidebar link navigates to /web/dashboard/Logs (NOT /ParkingLogs).
   * Direct CDN requests return AccessDenied — always use sidebar.
   */
  async navigate() {
    const base = process.env.BASE_URL || 'https://web.parksmart.io';
    const currentUrl = this.page.url();

    // If not on the SPA domain, go to root first
    if (!currentUrl.includes(base)) {
      await this.page.goto(`${base}/web/dashboard`);
      await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    }

    // If already on the Logs page, just return
    if (/\/web\/dashboard\/Logs/.test(this.page.url())) {
      return;
    }

    // Click the Parking Logs sidebar link
    const parkingLogsLink = this.page.getByRole('link', { name: 'Parking Logs' }).first();
    await parkingLogsLink.waitFor({ state: 'visible', timeout: 10000 });
    await parkingLogsLink.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    // URL becomes /web/dashboard/Logs
    await this.page.waitForURL(/\/web\/dashboard\/Logs/, { timeout: 10000 }).catch(() => {});
  }

  async goToSummaryTab() {
    await this.summaryTab.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  async goToLogsTab() {
    await this.logsTab.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  // -- Filters ---------------------------------------------------------------

  async applyFilter(filterName) {
    await this.filterButton.click();
    await this.page.waitForTimeout(400);
    await this.page.getByRole('radio', { name: filterName }).click();
    await this.confirmBtn.click();
    await this.applyBtn.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  }

  async clearFilters() {
    await this.filterButton.click();
    await this.page.waitForTimeout(400);
    if (await this.clearAllBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.clearAllBtn.click();
      await this.page.waitForTimeout(300);
    }
    if (await this.confirmBtn.isVisible({ timeout: 3000 }).catch(() => false))
      await this.confirmBtn.click();
    if (await this.applyBtn.isVisible({ timeout: 3000 }).catch(() => false))
      await this.applyBtn.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  }

  async isFilterChipVisible(filterName) {
    return this.page.getByRole('button', { name: filterName })
      .first().isVisible({ timeout: 3000 }).catch(() => false);
  }

  // -- Search ----------------------------------------------------------------

  async searchByVehicle(plateNumber) {
    await this.searchInput.click();
    await this.searchInput.clear();
    await this.searchInput.fill(plateNumber);
    await this.applyBtn.click();
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.applyBtn.click();
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  }

  // -- Table Reading ---------------------------------------------------------

  /** Reads total count from pagination without navigating. Call when on Logs tab. */
  async readLogsCount() {
    await this.tableRows.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    await this.page.waitForTimeout(500);

    if (await this.paginationInfo.isVisible({ timeout: 5000 }).catch(() => false)) {
      const text = await this.paginationInfo.textContent();
      const nums = (text || '').match(/\d+/g);
      if (nums && nums.length > 0)
        return parseInt(nums[nums.length - 1], 10);
    }
    const count = await this.tableRows.count();
    return count > 0 ? count - 1 : 0;
  }

  async getLogsTableTotalCount() {
    await this.goToLogsTab();
    return this.readLogsCount();
  }

  async isEmptyState() {
    return this.noDataMsg.isVisible({ timeout: 4000 }).catch(() => false);
  }

  async getColumnHeaders() {
    const headers = await this.tableHeaders.allTextContents();
    return headers.map(h => h.trim()).filter(Boolean);
  }

  // -- Summary KPIs ----------------------------------------------------------

  async getSummaryCardValue(cardLabel) {
    const narrowCard = this.page
      .locator('div, section')
      .filter({ hasText: new RegExp(`^\\s*${cardLabel}\\s*$`, 'i') })
      .first();
    const numEl = narrowCard.locator('h1, h2, h3, h4, span, p').filter({ hasText: /^\d+$/ }).first();
    const text = await numEl.textContent({ timeout: 6000 }).catch(() => null);
    if (text) {
      const m = text.match(/\d+/);
      if (m) return parseInt(m[0], 10);
    }
    const broadCard = this.page.locator('div').filter({ hasText: new RegExp(cardLabel, 'i') }).first();
    const broadNum  = broadCard.locator('[class*="text"], h1, h2, h3, h4, strong').first();
    const fallback  = await broadNum.textContent({ timeout: 5000 }).catch(() => '0');
    const m2 = (fallback || '').match(/\d+/);
    return m2 ? parseInt(m2[0], 10) : 0;
  }

  async getSummaryTotalCount() {
    await this.goToSummaryTab();
    const entered = await this.getSummaryCardValue('Entered');
    console.log(`[ParkSmartLogs] Summary KPI - Entered: ${entered}`);
    return entered;
  }

  async getAllSummaryKpis() {
    await this.goToSummaryTab();
    const [entered, exited, notExited] = await Promise.all([
      this.getSummaryCardValue('Entered'),
      this.getSummaryCardValue('Exited'),
      this.getSummaryCardValue('Not- Exited'),
    ]);
    return { entered, exited, notExited };
  }
};
