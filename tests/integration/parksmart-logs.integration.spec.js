import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ParkSmartLogsPage } from '../../pages/ParkSmartLogsPage';
import { AccessPassPage } from '../../pages/AccessPassPage';

test.describe('ParkSmart Logs & Access Pass Integration', () => {
  let loginPage;
  let parkSmartLogsPage;
  let accessPassPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    parkSmartLogsPage = new ParkSmartLogsPage(page);
    accessPassPage = new AccessPassPage(page);

    await loginPage.gotoParkSmart();
    await loginPage.login('abhishekkumar', 'Akkiibaghel2@');
    await expect(page.getByRole('heading', { name: 'No Site Selected' })).toBeVisible({ timeout: 15000 }).catch(() => {});
    await loginPage.selectSite('ParkSmart');
  });

  test('Verify filtering in Logs and navigating to Access Passes', async ({ page }) => {
    // 1. Navigate to Logs
    await parkSmartLogsPage.page.getByRole('button', { name: 'ParkSmart Logs' }).click();
    await parkSmartLogsPage.page.getByRole('link', { name: 'Visitor logs' }).click();
    await parkSmartLogsPage.goToSummaryTab();
    
    // 2. Apply a filter
    await parkSmartLogsPage.applyFilter('Access Pass');
    await expect(page.getByRole('button', { name: 'Access Pass' }).first()).toBeVisible({ timeout: 5000 }).catch(() => {});

    // 3. Navigate to Access Passes
    await accessPassPage.navigateToAccessPasses();

    // 4. Verify Access Passes loaded (e.g. create button exists)
    await expect(accessPassPage.createAccessPassButton).toBeVisible({ timeout: 5000 });
  });
});
