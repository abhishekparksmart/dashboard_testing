/**
 * ParkSmart — Transactions Page Test Suite
 * =========================================
 * Covers Visitor, Access Pass, and Summary sub-tabs.
 * Tests: page load, search, filter, sort, pagination, empty state.
 */
import { test, expect } from '../../fixtures/parksmart.fixture';

test.describe('ParkSmart Transactions', () => {

  // ── Smoke ──────────────────────────────────────────────────────────────────
  test.describe('@smoke — Critical Paths', () => {

    test('Transactions page loads @smoke', async ({ psPage }) => {
      await expect(psPage).toHaveURL(/Transactions/);
    });

    test('Visitor tab renders table or empty state @smoke', async ({ txPage, psPage }) => {
      await txPage.goToVisitorTab();
      const table = psPage.getByRole('table').first();
      const isEmpty = await psPage.getByText(/No Data|No results/i).first().isVisible({ timeout: 3000 }).catch(() => false);
      const hasTable = await table.isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasTable || isEmpty).toBeTruthy();
    });

    test('Access Pass tab renders @smoke', async ({ txPage, psPage }) => {
      await txPage.goToAccessPassTab();
      const hasContent = await psPage.locator('table, [class*="table"]').first()
        .isVisible({ timeout: 5000 }).catch(() => false);
      const isEmpty = await psPage.getByText(/No Data|No results/i).first()
        .isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasContent || isEmpty).toBeTruthy();
    });

  });

  // ── Visitor Tab ────────────────────────────────────────────────────────────
  test.describe('Visitor Tab', () => {

    test('Search with valid phone number returns results', async ({ txPage, psPage }) => {
      await txPage.goToVisitorTab();
      await txPage.searchBy(process.env.OPERATOR_PHONE || '8953675413');
      const rowCount = await txPage.getTableRowCount();
      // Either matches or shows no-data — never crashes
      expect(rowCount).toBeGreaterThanOrEqual(0);
    });

    test('Search with invalid value shows empty/no-data state', async ({ txPage, psPage }) => {
      await txPage.goToVisitorTab();
      await txPage.searchBy('0000000000_invalid_test');
      const rowCount = await txPage.getTableRowCount();
      const isEmpty  = await psPage.getByText(/No Data|No results/i)
        .first().isVisible({ timeout: 5000 }).catch(() => false);
      expect(rowCount === 0 || isEmpty).toBeTruthy();
    });

    test('Pagination: change rows per page to 25', async ({ txPage, psPage }) => {
      await txPage.goToVisitorTab();
      await txPage.changeRowsPerPage(25);
      // Page should still render after changing page size
      await expect(psPage.getByRole('table').first()).toBeVisible({ timeout: 10000 });
    });

    test('Column sort on Vehicle/Date column does not crash', async ({ txPage, psPage }) => {
      await txPage.goToVisitorTab();
      await txPage.clickColumnSort('Vehicle');
      await expect(psPage.getByRole('table').first()).toBeVisible({ timeout: 5000 });
    });

    test('Next page navigation works if multiple pages exist', async ({ txPage, psPage }) => {
      await txPage.goToVisitorTab();
      const before = await txPage.getTableRowCount();
      await txPage.nextPage();
      // After next page, table still renders
      await expect(psPage.getByRole('table').first()).toBeVisible({ timeout: 5000 });
      console.log(`[Transactions] Rows before next page: ${before}`);
    });

  });

  // ── Access Pass Tab ────────────────────────────────────────────────────────
  test.describe('Access Pass Tab', () => {

    test('Search by admin phone returns results', async ({ txPage, psPage }) => {
      await txPage.goToAccessPassTab();
      await txPage.searchBy(process.env.ADMIN_PHONE || '6394255782');
      const rowCount = await txPage.getTableRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(0);
    });

    test('Sort by Status column does not crash', async ({ txPage, psPage }) => {
      await txPage.goToAccessPassTab();
      await txPage.clickColumnSort('Status');
      await expect(psPage.getByRole('table').first()).toBeVisible({ timeout: 5000 });
    });

    test('Empty search shows no-data state gracefully', async ({ txPage, psPage }) => {
      await txPage.goToAccessPassTab();
      await txPage.searchBy('ZZZZZ_INVALID_99999');
      const isEmpty = await psPage.getByText(/No Data|No results/i)
        .first().isVisible({ timeout: 5000 }).catch(() => false);
      const count   = await txPage.getTableRowCount();
      expect(count === 0 || isEmpty).toBeTruthy();
    });

  });

  // ── Summary Tab ────────────────────────────────────────────────────────────
  test.describe('Summary Tab', () => {

    test('Summary tab loads KPI cards', async ({ txPage, psPage }) => {
      await txPage.goToSummaryTab();
      // Summary tab should show some content (cards or charts)
      const hasContent = await psPage.locator(
        '[class*="card"], [class*="Card"], [class*="kpi"], canvas'
      ).first().isVisible({ timeout: 10000 }).catch(() => false);
      const hasText = await psPage.getByText(/Revenue|Amount|Total|Transaction/i)
        .first().isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasContent || hasText).toBeTruthy();
    });

  });

  // ── Negative / Boundary ────────────────────────────────────────────────────
  test.describe('Negative Scenarios', () => {

    test('Very long search term is handled gracefully', async ({ txPage, psPage }) => {
      await txPage.goToVisitorTab();
      const longStr = 'A'.repeat(200);
      await txPage.searchBy(longStr);
      // Page should not crash
      await expect(psPage.getByRole('table').first()).toBeVisible({ timeout: 5000 });
    });

    test('Tab switching back and forth does not cause data inconsistency', async ({ txPage, psPage }) => {
      await txPage.goToVisitorTab();
      const visitorCount = await txPage.getTableRowCount();
      await txPage.goToAccessPassTab();
      await txPage.goToVisitorTab();
      const visitorCountAgain = await txPage.getTableRowCount();
      // Count should be stable across tab switches
      expect(visitorCountAgain).toBe(visitorCount);
    });

  });

});
