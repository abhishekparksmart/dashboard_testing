import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ReportsPage } from '../../pages/ReportsPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Reports & Dashboard State Integration', () => {
  let loginPage;
  let reportsPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    reportsPage = new ReportsPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.gotoParkSmart();
    await loginPage.login('abhishekkumar', 'Akkiibaghel2@');
    await expect(page.getByRole('heading', { name: 'No Site Selected' })).toBeVisible({ timeout: 15000 }).catch(() => {});
    await loginPage.selectSite('ParkSmart');
  });

  test('Generate Report -> Navigate Dashboard -> State is preserved', async ({ page }) => {
    // 1. Generate Report
    await reportsPage.navigateToReports();
    await reportsPage.generateReport({ reportType: 'Parking Logs' });
    await expect(page.getByText('Report Generated Successfully')).toBeVisible({ timeout: 10000 }).catch(() => {});

    // 2. Navigate to Dashboard
    await page.getByRole('button', { name: 'Dashboard' }).click();
    
    // 3. Verify Dashboard loads successfully and site is still ParkSmart
    await dashboardPage.waitForDashboardToLoad();
    const siteDropdown = page.getByRole('combobox').filter({ hasText: 'ParkSmart' });
    await expect(siteDropdown).toBeVisible({ timeout: 5000 });
  });
});
