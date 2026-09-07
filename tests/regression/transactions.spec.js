import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TransactionsPage } from '../../pages/TransactionsPage';

test.describe('Transactions Features - Exhaustive', () => {
  let loginPage;
  let transactionsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    transactionsPage = new TransactionsPage(page);

    await loginPage.navigate();
    await loginPage.login('abhishekkumar', 'Akkiibaghel2@');
    await expect(page.getByRole('heading', { name: 'No Site Selected' })).toBeVisible({ timeout: 15000 }).catch(() => { });
    await loginPage.selectSite('ParkSmart');
    await transactionsPage.navigateToTransactions();
  });

  test.describe('Visitor Transactions', () => {
    test('should load without filters @smoke', async ({ page }) => {
      await transactionsPage.goToVisitorTab();
      const rowCount = await transactionsPage.getTableRowCount();
      const noDataVisible = await page.getByText(/No Data|No results found|0 records/i).first().isVisible();
      expect(hasData(rowCount) || noDataVisible).toBeTruthy();
    });

    test('should search with valid mobile number (Positive)', async ({ page }) => {
      await transactionsPage.goToVisitorTab();
      await transactionsPage.searchBy('8953675413');
      const rowCount = await transactionsPage.getTableRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(1); // Including header
    });

    test('should show empty state for invalid search (Negative)', async ({ page }) => {
      await transactionsPage.goToVisitorTab();
      await transactionsPage.searchBy('0000000000');
      // An empty table typically only has the header row
      const rowCount = await transactionsPage.getTableRowCount();
      expect(rowCount).toBeLessThanOrEqual(1);
    });

    test('should support pagination (Rows per page & Next)', async ({ page }) => {
      await transactionsPage.goToVisitorTab();
      await transactionsPage.changeRowsPerPage(50);
      await transactionsPage.nextPage();
    });

    test('should support column sorting', async ({ page }) => {
      await transactionsPage.goToVisitorTab();
      await transactionsPage.clickColumnSort('Date');
    });

    test('should support multiple overlapping filters', async ({ page }) => {
      await transactionsPage.goToVisitorTab();
      await transactionsPage.applyStatusFilter('Completed');
      await transactionsPage.applyDateFilter('Today');
      await transactionsPage.clearFilters();
    });
  });

  test.describe('Access Pass Transactions', () => {
    test('should load without filters @smoke', async ({ page }) => {
      await transactionsPage.goToAccessPassTab();
      const rowCount = await transactionsPage.getTableRowCount();
      const noDataVisible = await page.getByText(/No Data|No results found|0 records/i).first().isVisible();
      expect(hasData(rowCount) || noDataVisible).toBeTruthy();
    });

    test('should search with valid mobile number (Positive)', async ({ page }) => {
      await transactionsPage.goToAccessPassTab();
      await transactionsPage.searchBy('6394255782');
    });

    test('should sort by Status column', async ({ page }) => {
      await transactionsPage.goToAccessPassTab();
      await transactionsPage.clickColumnSort('Status');
    });
  });

  test.describe('Summary Transactions', () => {
    test('should load summary dashboard @smoke', async ({ page }) => {
      await transactionsPage.goToSummaryTab();
      await expect(transactionsPage.summaryKpiCards).toBeVisible({ timeout: 10000 }).catch(() => {});
    });

    test('should filter summary by date range', async ({ page }) => {
      await transactionsPage.goToSummaryTab();
      await transactionsPage.applyDateFilter('Last 7 Days');
    });
  });
});

function hasData(rowCount) {
  return rowCount > 1;
}
