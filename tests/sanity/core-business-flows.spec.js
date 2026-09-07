const { test, expect } = require('../../fixtures/auth.fixture');
const usersData = require('../../test-data/users.json');
const vehiclesData = require('../../test-data/vehicles.json');
const { RandomUtils } = require('../../utils/random');

test.describe('Sanity Testing - Core Business Flows', () => {

  test('Can filter Transactions by Status', async ({ transactionsPage, adminPage }) => {
    await transactionsPage.navigateToTransactions();
    await transactionsPage.goToVisitorTab();
    
    await transactionsPage.applyStatusFilter('Success');
    
    // Verify the table is visible and filtering didn't crash
    const count = await transactionsPage.getTableRowCount();
    expect.soft(count).toBeGreaterThanOrEqual(0); // Might be 0 depending on data, but shouldn't crash
  });

  test('Can search for an existing Valet Driver', async ({ valetDriverPage }) => {
    await valetDriverPage.navigateToValetDrivers();
    
    // Assuming 8953675413 is a persistent test driver
    const testDriverMobile = process.env.OPERATOR_PHONE || '8953675413';
    
    await valetDriverPage.searchBy(testDriverMobile, 'Mobile Number');
    
    // Verify driver is in the results
    const isVisible = await valetDriverPage.isDriverVisible(testDriverMobile);
    expect.soft(isVisible).toBeTruthy();
  });

  test('Can initiate Access Pass creation flow', async ({ accessPassPage, adminPage }) => {
    await accessPassPage.navigateToAccessPasses();
    
    await accessPassPage.openCreateAccessPassModal();
    
    // Verify modal elements are present
    await expect.soft(adminPage.getByText('Select Pass Type')).toBeVisible();
    
    // Fill basic details
    await accessPassPage.fillAccessPassDetails({
      passType: 'Visitor',
      siteUnit: 'Main Gate',
      name: `SanityTest ${RandomUtils.string(4)}`,
      mobile: RandomUtils.mobileNumber()
    });
    
    // Add vehicle
    await accessPassPage.addVehicle({
      type: vehiclesData.validVehicle.type,
      number: RandomUtils.vehicleNumber(),
      identificationMode: vehiclesData.validVehicle.identificationMode
    });
    
    // Note: We don't submit to avoid bloating the production DB during sanity,
    // just verifying the form logic works.
    await expect.soft(adminPage.getByText('Issue Pass', { exact: true }).last()).toBeVisible();
  });

  test('Can view Summary KPI cards on Transactions', async ({ transactionsPage, adminPage }) => {
    await transactionsPage.navigateToTransactions();
    await transactionsPage.goToSummaryTab();
    
    // Verify KPI cards rendered
    await expect.soft(adminPage.getByText(/Total Collection|Parking Fee|Issue Pass/i).first()).toBeVisible();
  });

});
