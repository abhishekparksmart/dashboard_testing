'use strict';

const { test: base, expect } = require('@playwright/test');
const { LoginPage }              = require('../pages/LoginPage');
const { ParkSmartDashboardPage } = require('../pages/ParkSmartDashboardPage');
const { ParkSmartLogsPage }      = require('../pages/ParkSmartLogsPage');
const { TransactionsPage }       = require('../pages/TransactionsPage');
const { AccessPassPage }         = require('../pages/AccessPassPage');
const { ReportsPage }            = require('../pages/ReportsPage');
const { ValetDriverPage }        = require('../pages/ValetDriverPage');

/**
 * ParkSmart Playwright fixture.
 *
 * IMPORTANT SPA NOTE:
 *   Direct deep-link navigation (page.goto to /web/dashboard/ParkingLogs etc.)
 *   returns HTTP 403 AccessDenied from the CDN.
 *   All navigation must start from the SPA root (/web/dashboard) and then
 *   proceed via sidebar clicks or page.goto using the hash/history router.
 *
 * The `psPage` fixture lands on /web/dashboard (SPA root) already authenticated.
 * Individual page fixtures then navigate within the SPA.
 */
const test = base.extend({

  /**
   * Base authenticated page — lands on /web/dashboard with ParkSmart site selected.
   */
  psPage: async ({ page }, use) => {
    const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
    await page.goto(`${baseUrl}/web/dashboard`);
    await page.waitForLoadState('networkidle', { timeout: 20000 });

    // Handle "No Site Selected" prompt if session doesn't have site pre-selected
    const noSite = await page.getByRole('heading', { name: 'No Site Selected' })
      .isVisible({ timeout: 5000 }).catch(() => false);
    if (noSite) {
      const loginPage = new LoginPage(page);
      await loginPage.selectSite('ParkSmart');
    }

    await use(page);
  },

  /** Dashboard page object (no extra navigation) */
  dashboardPage: async ({ psPage }, use) => {
    await use(new ParkSmartDashboardPage(psPage));
  },

  /**
   * Parking Logs page object.
   * Navigates via sidebar link (SPA-safe, no direct CDN request).
   */
  logsPage: async ({ psPage }, use) => {
    const lp = new ParkSmartLogsPage(psPage);
    await lp.navigate(); // uses sidebar link internally
    await use(lp);
  },

  /**
   * Transactions page object — navigates via sidebar link.
   */
  txPage: async ({ psPage }, use) => {
    const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
    // Navigate via sidebar link (SPA-safe)
    const txLink = psPage.getByRole('link', { name: 'Transactions' }).first();
    const isVisible = await txLink.isVisible({ timeout: 5000 }).catch(() => false);
    if (isVisible) {
      await txLink.click();
    } else {
      // Fallback: reload SPA root then click
      await psPage.goto(`${baseUrl}/web/dashboard`);
      await psPage.waitForLoadState('networkidle', { timeout: 15000 });
      await psPage.getByRole('link', { name: 'Transactions' }).first().click();
    }
    await psPage.waitForLoadState('networkidle', { timeout: 15000 });
    const tp = new TransactionsPage(psPage);
    await use(tp);
  },

  /**
   * Access Passes page object — navigates via Access Management sidebar.
   */
  apPage: async ({ psPage }, use) => {
    const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
    // Try expanding Access Management
    const mgmtBtn = psPage.getByRole('button', { name: /Access Manage/i }).first();
    if (await mgmtBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const expanded = await mgmtBtn.getAttribute('aria-expanded');
      if (expanded !== 'true') await mgmtBtn.click();
    }
    const link = psPage.getByRole('link', { name: /Access Pass/i }).first();
    if (await link.isVisible({ timeout: 5000 }).catch(() => false)) {
      await link.click();
    } else {
      // Fallback direct internal nav — reload root first so SPA is loaded
      await psPage.goto(`${baseUrl}/web/dashboard`);
      await psPage.waitForLoadState('networkidle', { timeout: 15000 });
      const btn2 = psPage.getByRole('button', { name: /Access Manage/i }).first();
      await btn2.click().catch(() => {});
      await psPage.getByRole('link', { name: /Access Pass/i }).first().click();
    }
    await psPage.waitForLoadState('networkidle', { timeout: 15000 });
    const ap = new AccessPassPage(psPage);
    await use(ap);
  },

  /** Reports page object (no auto-navigation — caller navigates) */
  reportsPage: async ({ psPage }, use) => {
    await use(new ReportsPage(psPage));
  },

  /**
   * Valet Drivers page object — navigates via Valet Management sidebar.
   */
  valetPage: async ({ psPage }, use) => {
    const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
    const mgmtBtn = psPage.getByRole('button', { name: /Valet Manage/i }).first();
    if (await mgmtBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const expanded = await mgmtBtn.getAttribute('aria-expanded');
      if (expanded !== 'true') await mgmtBtn.click();
    }
    const link = psPage.getByRole('link', { name: /Valet Driver/i }).first();
    if (await link.isVisible({ timeout: 5000 }).catch(() => false)) {
      await link.click();
    } else {
      await psPage.goto(`${baseUrl}/web/dashboard`);
      await psPage.waitForLoadState('networkidle', { timeout: 15000 });
      const vp = new ValetDriverPage(psPage);
      await vp.navigateToValetDrivers();
      await use(vp);
      return;
    }
    await psPage.waitForLoadState('networkidle', { timeout: 15000 });
    const vp = new ValetDriverPage(psPage);
    await use(vp);
  },
});

module.exports = { test, expect };
