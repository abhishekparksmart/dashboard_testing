const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { TransactionsPage } = require('../../pages/TransactionsPage');
const { AccessPassPage } = require('../../pages/AccessPassPage');
const { Env } = require('../../config/env');
const { VehicleApi } = require('../../api/vehicle.api');

// Setup environment variables manually if running this single file
test.beforeAll(() => {
    Env.load();
});

test.describe('Master End-to-End Flow', () => {
  let vehicleApi;
  let createdVehicleId;

  test('Complete User Journey - Vehicle Entry to Transaction Report', async ({ page, request }) => {
    // 1. API Setup (Initialize API context)
    vehicleApi = new VehicleApi(request);

    // 2. Initialize Pages
    const loginPage = new LoginPage(page);
    const accessPassPage = new AccessPassPage(page);
    const transactionsPage = new TransactionsPage(page);

    // Step 1: Login
    await test.step('Login to the application', async () => {
      await loginPage.navigate();
      await loginPage.login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
      expect.soft(await page.url()).toContain('dashboard');
    });

    // Step 2: Select Site
    await test.step('Select Site', async () => {
      await loginPage.selectSite('ParkSmart');
      expect.soft(await page.getByRole('heading', { name: 'ParkSmart Dashboard' }).isVisible()).toBeTruthy();
    });

    // Step 3: Create Vehicle Entry (using Access Pass UI as example)
    await test.step('Create Vehicle Entry', async () => {
      await accessPassPage.navigateToAccessPasses();
      await accessPassPage.openCreateAccessPassModal();
      
      await accessPassPage.fillAccessPassDetails({
        passType: 'Visitor',
        siteUnit: 'Main Gate',
        name: 'John Doe',
        mobile: '9999999999'
      });

      await accessPassPage.addVehicle({
        type: 'Car',
        number: 'DL01AB1234',
        identificationMode: 'FasTag'
      });

      await accessPassPage.submitCreatePass();
      // Assuming a success toast appears
      expect.soft(await page.getByText(/successfully/i).first().isVisible()).toBeTruthy();
    });

    // Step 4: Verify Transaction
    await test.step('Verify Transaction', async () => {
      await transactionsPage.navigateToTransactions();
      await transactionsPage.goToVisitorTab();
      
      await transactionsPage.searchBy('9999999999');
      const count = await transactionsPage.getTableRowCount();
      expect.soft(count).toBeGreaterThan(0);
    });

    // Step 5: Logout
    await test.step('Logout', async () => {
      await loginPage.logout();
      expect.soft(await loginPage.isErrorMessageVisible()).toBeFalsy();
    });
  });

  test.afterAll(async () => {
    // 3. API Cleanup
    if (createdVehicleId) {
      await vehicleApi.deleteVehicle(createdVehicleId);
    }
  });
});
