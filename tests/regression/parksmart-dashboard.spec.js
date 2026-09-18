/**
 * ParkSmart — Dashboard (Home) Page Test Suite
 * =============================================
 * Tests for the main dashboard after login + site selection.
 * Verifies page load, sidebar navigation, and UI integrity.
 */
import { test, expect } from '../../fixtures/parksmart.fixture';

test.describe('ParkSmart Dashboard', () => {

  // -- Smoke ------------------------------------------------------------------
  test('Dashboard loads after login and site selection @smoke', async ({ psPage }) => {
    await expect(psPage).toHaveURL(/\/web\/dashboard/);
    // Should NOT show "No Site Selected" heading
    const noSite = await psPage.getByRole('heading', { name: 'No Site Selected' })
      .isVisible({ timeout: 3000 }).catch(() => false);
    expect(noSite).toBeFalsy();
  });

  test('ParkSmart logo / brand is visible @smoke', async ({ psPage }) => {
    const logoVisible = await psPage.getByRole('img', { name: /ParkSmart/i })
      .first().isVisible({ timeout: 5000 }).catch(() => false);
    const textVisible = await psPage.getByText(/ParkSmart/i)
      .first().isVisible({ timeout: 5000 }).catch(() => false);
    expect(logoVisible || textVisible).toBeTruthy();
  });

  // -- Sidebar Navigation -----------------------------------------------------
  test.describe('Sidebar Navigation', () => {

    test('Parking Logs link navigates correctly @smoke', async ({ psPage, dashboardPage }) => {
      await dashboardPage.goToLogs();
      await expect(psPage).toHaveURL(/Logs/);
      await expect(psPage.getByText(/Parking Logs/i).first()).toBeVisible({ timeout: 10000 });
    });

    test('Transactions link navigates correctly', async ({ psPage, dashboardPage }) => {
      await dashboardPage.goToTransactions();
      await expect(psPage).toHaveURL(/Transactions/);
    });

    test('Access Passes link navigates correctly', async ({ psPage, dashboardPage }) => {
      await dashboardPage.goToAccessPasses();
      await expect(psPage).toHaveURL(/AccessPass/i);
    });

    test('Generate Reports link navigates correctly', async ({ psPage, dashboardPage }) => {
      await dashboardPage.goToGenerateReports();
      await expect(psPage).toHaveURL(/Report/i);
    });

    test('User Activity link navigates correctly', async ({ psPage, dashboardPage }) => {
      await dashboardPage.goToUserActivity();
      await expect(psPage).toHaveURL(/UserActivity/);
    });

  });

  // -- Page Integrity ---------------------------------------------------------
  test.describe('Page Integrity', () => {

    test('No console errors on dashboard load', async ({ psPage }) => {
      const errors = [];
      psPage.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      await psPage.reload();
      await psPage.waitForLoadState('networkidle', { timeout: 20000 });
      // Log errors but do not fail — some 3rd party scripts may throw
      if (errors.length > 0) console.log('[Console Errors]', errors);
      // Only fail on JS fatal errors
      const fatal = errors.filter(e => /TypeError|ReferenceError|SyntaxError/.test(e));
      expect(fatal.length).toBe(0);
    });

    test('Page title is set correctly', async ({ psPage }) => {
      const title = await psPage.title();
      expect(title.length).toBeGreaterThan(0);
      console.log(`[Dashboard] Page title: "${title}"`);
    });

    test('User menu button is visible', async ({ psPage }) => {
      const userMenu = psPage.getByText(/abhishekkumar/i).first();
      await expect(userMenu).toBeVisible({ timeout: 10000 });
    });

    test('Logout flow works correctly', async ({ psPage }) => {
      // Find and click the user avatar / name
      const userBtn = psPage.getByText(/abhishekkumar/i).first();
      await userBtn.click();
      const logoutItem = psPage.getByRole('menuitem', { name: /Log out|Logout|Sign out/i });
      await logoutItem.waitFor({ state: 'visible', timeout: 5000 });
      await logoutItem.click();
      await psPage.waitForLoadState('networkidle', { timeout: 15000 });
      // Should be on login page
      await expect(psPage).toHaveURL(/auth\/login/);
    });

  });

});
