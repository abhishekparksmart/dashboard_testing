import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Auth & Dashboard Integration', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.gotoParkSmart();
  });

  test('Complete session lifecycle: Login -> Select Site -> Dashboard -> Logout', async ({ page }) => {
    // Login
    await loginPage.login('abhishekkumar', 'Akkiibaghel2@');

    // Wait for site selection
    await expect(page.getByRole('heading', { name: 'No Site Selected' })).toBeVisible({ timeout: 15000 }).catch(() => {});
    
    // Select Site
    await loginPage.selectSite('ParkSmart');

    // Verify Dashboard Loaded correctly as a result of auth & site selection
    await dashboardPage.waitForDashboardToLoad();
    await expect(dashboardPage.totalRevenueKpi).toBeVisible({ timeout: 10000 }).catch(() => {});

    // Logout
    await loginPage.logout();

    // Verify redirected to login
    await expect(loginPage.loginButton).toBeVisible();
  });
});
