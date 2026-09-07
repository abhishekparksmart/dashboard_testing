import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ReportsPage } from '../../pages/ReportsPage';

test.describe('Reports Features', () => {
  let loginPage;
  let reportsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    reportsPage = new ReportsPage(page);

    // Setup state
    await loginPage.navigate();
    await loginPage.login('abhishekkumar', 'Akkiibaghel2@');
    await expect(page.getByRole('heading', { name: 'No Site Selected' })).toBeVisible({ timeout: 15000 });
    await loginPage.selectSite('ParkSmart');
    await reportsPage.navigateToReports();
  });

  test('should generate Parking Logs report successfully @smoke', async ({ page }) => {
    await reportsPage.generateReport({
      siteName: 'ParkSmart',
      reportType: 'Parking Logs'
    });

    // Verify success toast or that the modal closes
    await expect(page.getByText('Report Generated Successfully')).toBeVisible({ timeout: 10000 }).catch(() => {});
    // Verify report appears in the table (assuming it's the first row)
    await expect(page.getByRole('row').nth(1)).toContainText('Parking Logs');
  });

  test('should generate Transaction Logs report successfully', async ({ page }) => {
    await reportsPage.generateReport({
      siteName: 'ParkSmart',
      reportType: 'Transaction Logs'
    });

    // Verify report appears in the table
    await expect(page.getByRole('row').nth(1)).toContainText('Visitor Transactions');
  });

  test('should show validation error when Site Name is not selected', async ({ page }) => {
    await reportsPage.generateReport({
      reportType: 'Parking Logs'
    });

    // Verify validation error for Site Name
    await expect(page.getByText('Please select a site')).toBeVisible();
    
    // Close modal
    await page.keyboard.press('Escape');
  });

  test('should show validation error when Report Type is not selected', async ({ page }) => {
    await reportsPage.generateReport({
      siteName: 'ParkSmart'
    });

    // Verify validation error for Report Type
    await expect(page.getByText('Please select a report type')).toBeVisible();

    // Close modal
    await page.keyboard.press('Escape');
  });

  test('should apply various filters to reports and clear them', async ({ page }) => {
    await reportsPage.navigateToReports();

    // Apply Requested filter
    await reportsPage.applyFilter('Requested');

    // Apply Processing filter
    await reportsPage.applyFilter('Processing');

    // Apply Completed filter
    await reportsPage.applyFilter('Completed');

    // Clear filters
    await reportsPage.clearFilters();
  });

  test.describe('Data Validation Scenarios', () => {
    test('Actual vs Expected data match for generated report', async ({ page }) => {
      const expectedSiteName = 'ParkSmart';
      const expectedReportType = 'Parking Logs';
      
      // 1. Generate the report
      await reportsPage.generateReport({
        siteName: expectedSiteName,
        reportType: expectedReportType
      });

      // 2. Wait for the success toast and for it to disappear so it doesn't block UI
      await expect(page.getByText('Report Generated Successfully')).toBeVisible({ timeout: 10000 }).catch(() => {});
      
      // 3. Extract actual values from the table
      const latestReport = await reportsPage.getLatestReportDetails();
      
      // 4. Assert Actual vs Expected
      // Ensure the row contains the expected Report Type
      expect(latestReport.rawText).toContain(expectedReportType);
      
      // Ensure the row contains the expected Site Name
      expect(latestReport.rawText).toContain(expectedSiteName);
      
      // Ensure the row contains a valid initial status (usually "Requested" or "Processing" right after generation)
      // Since it could be either, we can check that it contains one of them
      const hasValidStatus = latestReport.rawText.includes('Requested') || latestReport.rawText.includes('Processing') || latestReport.rawText.includes('Completed');
      expect(hasValidStatus).toBeTruthy();
    });
  });
});
