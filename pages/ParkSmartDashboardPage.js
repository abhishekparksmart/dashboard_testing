'use strict';

/**
 * Page Object for the ParkSmart main Dashboard (home) page.
 * URL: /web/dashboard
 * Reached after login + selecting the "ParkSmart" site.
 */
exports.ParkSmartDashboardPage = class ParkSmartDashboardPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Brand / header
    this.logo           = page.getByRole('img', { name: /ParkSmart/i }).first();
    this.siteSelector   = page.getByRole('combobox').filter({ hasText: /Site Name|ParkSmart/i }).first();
    this.userMenuButton = page.locator('button').filter({ has: page.locator('img[alt*="avatar"], img[alt*="user"]') }).first()
      .or(page.getByRole('button', { name: /abhishekkumar/i }));

    // Sidebar navigation links (exact text as visible)
    this.sidebarLinks = {
      Logs:      page.getByRole('link', { name: 'Parking Logs' }),
      transactions:     page.getByRole('link', { name: 'Transactions' }),
      reports:          page.getByRole('button', { name: 'Reports', exact: true }),
      accessManagement: page.getByRole('button', { name: /Access Manage/i }),
      valetManagement:  page.getByRole('button', { name: /Valet Manage/i }),
      userActivity:     page.getByRole('link', { name: 'User Activity' }),
      userManagement:   page.getByRole('button', { name: /User Manage/i }),
    };

    // Dashboard KPI / summary cards (generic — varies by site config)
    this.kpiCards = page.locator('div').filter({ hasText: /Entered|Exited|Revenue|Vehicles|Occupancy/i });

    // Charts (canvas or recharts)
    this.chartArea = page.locator('canvas, .recharts-wrapper, [class*="chart"]').first();

    // Site selection (shown when no site is selected)
    this.noSiteHeading  = page.getByRole('heading', { name: 'No Site Selected' });
    this.siteNameCombo  = page.getByRole('combobox').filter({ hasText: 'Site Name' });
    this.siteSearchBox  = page.getByPlaceholder('Search...');
  }

  // -- Navigation ------------------------------------------------------------

  async navigate() {
    const base = process.env.BASE_URL || 'https://web.parksmart.io';
    await this.page.goto(`${base}/web/dashboard`);
    await this.page.waitForLoadState('networkidle', { timeout: 20000 });
  }

  /** Select the ParkSmart site if the "No Site Selected" prompt is shown. */
  async selectSiteIfNeeded(siteName = 'ParkSmart') {
    const needsSite = await this.noSiteHeading.isVisible({ timeout: 5000 }).catch(() => false);
    if (!needsSite) return;
    await this.siteNameCombo.click();
    await this.siteSearchBox.fill(siteName);
    await this.page.getByRole('option', { name: siteName, exact: true }).click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  // -- Sidebar Navigation ----------------------------------------------------

  async goToLogs() {
    await this.sidebarLinks.Logs.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async goToTransactions() {
    await this.sidebarLinks.transactions.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async goToAccessPasses() {
    await this.sidebarLinks.accessManagement.click();
    const link = this.page.getByRole('link', { name: /Access Pass/i }).first();
    await link.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await link.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async goToGenerateReports() {
    await this.sidebarLinks.reports.click();
    await this.page.getByRole('link', { name: 'Generate Reports' }).click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  async goToUserActivity() {
    await this.sidebarLinks.userActivity.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  // -- Logout ----------------------------------------------------------------

  async logout() {
    await this.userMenuButton.click();
    await this.page.getByRole('menuitem', { name: /Log out/i }).click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
  }

  // -- Validation Helpers ----------------------------------------------------

  async isOnDashboard() {
    return /\/web\/dashboard/.test(this.page.url());
  }

  async isDashboardLoaded() {
    // Page should not show "No Site Selected"
    const noSite = await this.noSiteHeading.isVisible({ timeout: 3000 }).catch(() => false);
    return !noSite;
  }
};
