import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { AccessPassPage } from '../../pages/AccessPassPage';
import { ParkSmartLogsPage } from '../../pages/ParkSmartLogsPage';

test.describe('Access Pass & Logs Integration', () => {
  let loginPage;
  let accessPassPage;
  let parkSmartLogsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    accessPassPage = new AccessPassPage(page);
    parkSmartLogsPage = new ParkSmartLogsPage(page);

    await loginPage.gotoParkSmart();
    await loginPage.login('abhishekkumar', 'Akkiibaghel2@');
    await expect(page.getByRole('heading', { name: 'No Site Selected' })).toBeVisible({ timeout: 15000 }).catch(() => {});
    await loginPage.selectSite('ParkSmart');
  });

  test('Create Access Pass -> Verify it is logged in Summary/Logs', async ({ page }) => {
    // 1. Create an Access Pass
    await accessPassPage.navigateToAccessPasses();
    await accessPassPage.openCreateAccessPassModal();
    await accessPassPage.fillAccessPassDetails({
      passType: 'Admin',
      siteUnit: 'Abhishek Test PS',
      name: 'Integration Test User',
      mobile: '6394255782', // Allowed number
      email: 'integration@test.com',
      additionalInfo: 'integration',
      gender: 'Male'
    });
    await accessPassPage.addVehicle({
      type: 'Car',
      number: 'INT9999',
      identificationMode: 'ANPR'
    });
    await accessPassPage.submitCreatePass();
    
    // Allow toast to dismiss
    await page.waitForTimeout(2000);

    // 2. Navigate to ParkSmart Logs
    // We expect the new Access Pass to influence the total count or be filterable
    await parkSmartLogsPage.page.getByRole('button', { name: 'ParkSmart Logs' }).click();
    await parkSmartLogsPage.page.getByRole('link', { name: 'Visitor logs' }).click();

    // 3. Verify interaction
    await parkSmartLogsPage.goToSummaryTab();
    await parkSmartLogsPage.applyFilter('Access Pass');
    
    const summaryTotal = await parkSmartLogsPage.getSummaryTotalCount();
    expect(summaryTotal).toBeGreaterThanOrEqual(1);
  });
});
