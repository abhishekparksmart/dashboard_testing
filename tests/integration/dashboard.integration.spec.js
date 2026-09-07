import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { ReportsPage } from '../../pages/ReportsPage';

test.describe('Dashboard & Reports Integration', () => {
  let loginPage;
  let dashboardPage;
  let reportsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    reportsPage = new ReportsPage(page);

    await loginPage.gotoParkSmart();
    await loginPage.login('abhishekkumar', 'Akkiibaghel2@');
    await expect(page.getByRole('heading', { name: 'No Site Selected' })).toBeVisible({ timeout: 15000 }).catch(() => {});
    await loginPage.selectSite('ParkSmart');
  });

  test('Cross-navigation: Dashboard -> Reports -> Validate global state', async ({ page }) => {
    // Verify Dashboard
    await dashboardPage.waitForDashboardToLoad();
    await dashboardPage.selectDateRange('Last 7 Days');

    // Navigate to Reports
    await reportsPage.navigateToReports();
    
    // Verify site state is retained across navigation
    // (If the app drops the site context, the 'Generate Report' modal will demand a site selection from scratch)
    await reportsPage.generateReport({ reportType: 'Parking Logs' });
    
    // If it fails with "Please select a site", then global state wasn't retained.
    // If it succeeds, the state was passed successfully.
    await expect(page.getByText('Please select a site')).not.toBeVisible({ timeout: 5000 });
    
    // Close any modal just in case
    await page.keyboard.press('Escape');
  });
});
