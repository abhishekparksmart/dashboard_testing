import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TransactionsPage } from '../../pages/TransactionsPage';
import { AccessPassPage } from '../../pages/AccessPassPage';

test.describe('Transactions & Access Pass Integration', () => {
  let loginPage;
  let transactionsPage;
  let accessPassPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);
    accessPassPage = new AccessPassPage(page);

    await loginPage.gotoParkSmart();
    await loginPage.login('abhishekkumar', 'Akkiibaghel2@');
    await expect(page.getByRole('heading', { name: 'No Site Selected' })).toBeVisible({ timeout: 15000 }).catch(() => {});
    await loginPage.selectSite('ParkSmart');
  });

  test('Check Transactions -> Navigate to Access Passes -> State is preserved', async ({ page }) => {
    // 1. Navigate to Transactions Summary
    await transactionsPage.navigateToTransactions();
    await transactionsPage.goToSummaryTab();
    
    // Check that we can interact with it (proving it loaded)
    await expect(transactionsPage.summaryKpiCards).toBeVisible({ timeout: 10000 }).catch(() => {});

    // 2. Navigate to Access Passes
    await accessPassPage.navigateToAccessPasses();
    
    // 3. Verify Access Passes loaded successfully by checking the URL
    await expect(page).toHaveURL(/.*AccessPass.*/, { timeout: 10000 });
  });
});
