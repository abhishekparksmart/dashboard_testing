import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { UserActivityPage } from '../../pages/UserActivityPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('User Activity & Dashboard Integration', () => {
  let loginPage;
  let userActivityPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    userActivityPage = new UserActivityPage(page);
    dashboardPage = new DashboardPage(page);

    await loginPage.gotoParkSmart();
    await loginPage.login('abhishekkumar', 'Akkiibaghel2@');
    await expect(page.getByRole('heading', { name: 'No Site Selected' })).toBeVisible({ timeout: 15000 }).catch(() => {});
    await loginPage.selectSite('ParkSmart');
  });

  test('Check User Activity -> Navigate to Dashboard -> Refresh Dashboard Data', async ({ page }) => {
    // 1. Check User Activity
    await userActivityPage.navigateToUserActivity();
    await expect(userActivityPage.tableRows.first()).toBeVisible({ timeout: 10000 });

    // 2. Navigate to Dashboard
    await page.getByRole('button', { name: 'Dashboard' }).click();
    await dashboardPage.waitForDashboardToLoad();
    
    // 3. Perform an action on the dashboard (Refresh data)
    if (await dashboardPage.refreshDataButton.isVisible()) {
      await dashboardPage.refreshDataButton.click();
      await expect(dashboardPage.totalRevenueKpi).toBeVisible(); 
    }
    
    // Verify successful cross-navigation
    expect(page.url()).toContain('/Dashboard');
  });
});
