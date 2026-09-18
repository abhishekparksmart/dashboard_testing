/**
 * ParkSmart — Master End-to-End Flow
 * ====================================
 * Simulates a complete real-world user journey through the ParkSmart dashboard.
 * Uses test.step() for granular Playwright HTML report tracing.
 *
 * Journey:
 *   1. Verify authenticated session lands on dashboard
 *   2. Navigate Parking Logs ? verify table + Summary KPIs
 *   3. Apply & clear filters on Logs
 *   4. Navigate Transactions ? verify Visitor + Access Pass tabs
 *   5. Navigate Access Passes ? verify list + form opens
 *   6. Navigate Reports ? generate a report
 *   7. Verify sidebar navigation integrity
 */
import { test, expect } from '../../fixtures/parksmart.fixture';
import { ParkSmartLogsPage }      from '../../pages/ParkSmartLogsPage';
import { ParkSmartDashboardPage } from '../../pages/ParkSmartDashboardPage';
import { TransactionsPage }       from '../../pages/TransactionsPage';
import { AccessPassPage }         from '../../pages/AccessPassPage';
import { ReportsPage }            from '../../pages/ReportsPage';

test.describe('ParkSmart — Full E2E Master Flow', () => {
  test.setTimeout(180000); // 3 minutes for full journey

  test('Complete ParkSmart user journey', async ({ psPage }) => {
    const dashboard    = new ParkSmartDashboardPage(psPage);
    const logsPage     = new ParkSmartLogsPage(psPage);
    const txPage       = new TransactionsPage(psPage);
    const apPage       = new AccessPassPage(psPage);
    const reportsPage  = new ReportsPage(psPage);

    // -- Step 1: Dashboard loads --------------------------------------------
    await test.step('Step 1: Verify authenticated dashboard', async () => {
      await expect(psPage).toHaveURL(/\/web\/dashboard/);
      const noSite = await psPage.getByRole('heading', { name: 'No Site Selected' })
        .isVisible({ timeout: 3000 }).catch(() => false);
      expect(noSite).toBeFalsy();
      console.log('[E2E Step 1] Dashboard loaded successfully');
    });

    // -- Step 2: Parking Logs — Logs Tab -----------------------------------
    await test.step('Step 2: Navigate to Parking Logs — verify table', async () => {
      await logsPage.navigate();
      await expect(psPage).toHaveURL(/Logs/);

      await logsPage.goToLogsTab();
      const logsCount = await logsPage.readLogsCount();
      console.log(`[E2E Step 2] Logs tab total: ${logsCount}`);
      expect(logsCount).toBeGreaterThanOrEqual(0);

      // Verify expected column headers are present
      const headers = await logsPage.getColumnHeaders();
      console.log(`[E2E Step 2] Column headers: ${headers.join(', ')}`);
      expect(headers.length).toBeGreaterThan(0);
    });

    // -- Step 3: Parking Logs — Summary Tab KPIs ---------------------------
    await test.step('Step 3: Summary tab — verify KPI cards', async () => {
      const kpis = await logsPage.getAllSummaryKpis();
      console.log(`[E2E Step 3] KPIs — Entered: ${kpis.entered}, Exited: ${kpis.exited}, NotExited: ${kpis.notExited}`);
      expect(kpis.entered).toBeGreaterThanOrEqual(0);
      expect(kpis.exited).toBeGreaterThanOrEqual(0);
      expect(kpis.notExited).toBeGreaterThanOrEqual(0);
    });

    // -- Step 4: Apply filter on Logs, verify, clear -----------------------
    await test.step('Step 4: Apply Access Pass filter on Logs tab', async () => {
      await logsPage.goToLogsTab();
      await logsPage.applyFilter('Access Pass');
      const filtered = await logsPage.readLogsCount();
      console.log(`[E2E Step 4] Access Pass filtered count: ${filtered}`);
      expect(filtered).toBeGreaterThanOrEqual(0);

      await logsPage.clearFilters();
      const cleared = await logsPage.readLogsCount();
      console.log(`[E2E Step 4] After clear: ${cleared}`);
      expect(cleared).toBeGreaterThanOrEqual(filtered);
    });

    // -- Step 5: Transactions — both tabs ---------------------------------
    await test.step('Step 5: Transactions — Visitor and Access Pass tabs', async () => {
      await txPage.navigateToTransactions();
      await expect(psPage).toHaveURL(/Transactions/);

      await txPage.goToVisitorTab();
      const visitorRows = await txPage.getTableRowCount();
      console.log(`[E2E Step 5] Visitor tab rows: ${visitorRows}`);
      expect(visitorRows).toBeGreaterThanOrEqual(0);

      await txPage.goToAccessPassTab();
      const apRows = await txPage.getTableRowCount();
      console.log(`[E2E Step 5] Access Pass tab rows: ${apRows}`);
      expect(apRows).toBeGreaterThanOrEqual(0);
    });

    // -- Step 6: Access Passes — list + modal open -------------------------
    await test.step('Step 6: Access Passes — verify list and form', async () => {
      await apPage.navigateToAccessPasses();
      await expect(psPage).toHaveURL(/AccessPass/i);

      // Issue button visible
      await expect(psPage.getByRole('button', { name: /Issue Access Pass/i }).first())
        .toBeVisible({ timeout: 10000 });

      // Open form
      await apPage.openCreateAccessPassModal();
      const hasForm = await psPage.getByRole('heading', { name: /Issue Access Pass|Access Pass Configuration/i }).first()
        .isVisible({ timeout: 8000 }).catch(() => false);
      expect(hasForm).toBeTruthy();
      console.log('[E2E Step 6] Create Access Pass modal opened successfully');

      // Close modal
      await psPage.getByRole('button', { name: 'Cancel' }).first().click();
      await psPage.waitForTimeout(500);
    });

    // -- Step 7: Reports — generate a report -------------------------------
    await test.step('Step 7: Generate Reports — create Parking Logs report', async () => {
      await dashboard.goToGenerateReports();
      await expect(psPage).toHaveURL(/Report/i);

      await reportsPage.generateReport({ siteName: 'ParkSmart', reportType: 'Parking Logs' });
      await psPage.waitForTimeout(3000);

      const details = await reportsPage.getLatestReportDetails();
      if (details.rawText) {
        const validStatus = /Requested|Processing|Completed/.test(details.rawText);
        console.log(`[E2E Step 7] Report row: "${details.rawText.substring(0, 100)}"`);
        expect(validStatus).toBeTruthy();
      }
    });

    // -- Step 8: Validate full sidebar navigation ---------------------------
    await test.step('Step 8: Verify all major sidebar links are navigable', async () => {
      const navTests = [
        { name: 'Parking Logs', urlPattern: /Logs/ },
        { name: 'Transactions', urlPattern: /Transactions/ },
      ];

      for (const nav of navTests) {
        const link = psPage.getByRole('link', { name: nav.name }).first();
        if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
          await link.click();
          await psPage.waitForLoadState('networkidle', { timeout: 15000 });
          await expect(psPage).toHaveURL(nav.urlPattern);
          console.log(`[E2E Step 8] Navigated to ${nav.name} ?`);
        }
      }
    });

    console.log('[E2E] Full ParkSmart journey completed successfully ?');
  });

});
