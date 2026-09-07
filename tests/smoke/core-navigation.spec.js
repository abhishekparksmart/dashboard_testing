const { test, expect } = require('../../fixtures/auth.fixture');

test.describe('Smoke Testing - Core Navigation & Critical Paths', () => {

  test('User can successfully login and view Dashboard', async ({ adminPage }) => {
    // The adminPage fixture automatically logs in, but we need to navigate to dashboard
    const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
    await adminPage.goto(`${baseUrl}/web/dashboard`);
    await adminPage.waitForLoadState('networkidle');
    
    // Check if we need to select a site
    if (await adminPage.getByRole('heading', { name: 'No Site Selected' }).isVisible({ timeout: 2000 }).catch(() => false)) {
      await adminPage.getByRole('combobox').filter({ hasText: 'Site Name' }).click();
      await adminPage.getByPlaceholder('Search...').fill('ParkSmart');
      await adminPage.getByRole('option', { name: 'ParkSmart', exact: true }).click();
    }
    
    // Verify Dashboard loads
    await expect.soft(adminPage).toHaveURL(/.*dashboard.*/);
  });

  test('Transactions page loads without errors', async ({ transactionsPage, adminPage }) => {
    await transactionsPage.navigateToTransactions();
    
    // Verify table loads
    await expect.soft(adminPage.getByRole('table').first()).toBeVisible();
    await expect.soft(adminPage.getByRole('button', { name: /Visitor/i })).toBeVisible();
  });

  test('Access Passes page loads without errors', async ({ accessPassPage, adminPage }) => {
    await accessPassPage.navigateToAccessPasses();
    
    // Verify Create button is visible
    await expect.soft(adminPage.getByRole('button', { name: 'Issue Access Pass' })).toBeVisible();
  });

  test('Valet Drivers page loads without errors', async ({ valetDriverPage, adminPage }) => {
    await valetDriverPage.navigateToValetDrivers();
    
    // Verify search and table is visible
    await expect.soft(adminPage.getByPlaceholder('Search by')).toBeVisible();
    await expect.soft(adminPage.getByRole('table').first()).toBeVisible();
  });

});
