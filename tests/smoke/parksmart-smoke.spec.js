/**
 * ParkSmart — Smoke Test Suite
 * ==============================
 * Critical happy paths only. Must run in under 3 minutes.
 * These tests gate every deployment.
 */
import { test, expect } from '../../fixtures/parksmart.fixture';

test.describe('ParkSmart Smoke Tests', () => {

  test('S01 — Dashboard loads after authentication @smoke', async ({ psPage }) => {
    await expect(psPage).toHaveURL(/\/web\/dashboard/);
    const crash = await psPage.getByText(/Error|Something went wrong|500/i)
      .first().isVisible({ timeout: 3000 }).catch(() => false);
    expect(crash).toBeFalsy();
  });

  test('S02 — Parking Logs page loads with Logs and Summary tabs @smoke', async ({ logsPage, psPage }) => {
    await expect(psPage).toHaveURL(/Logs/);
    await expect(logsPage.logsTab).toBeVisible({ timeout: 10000 });
    await expect(logsPage.summaryTab).toBeVisible({ timeout: 10000 });
  });

  test('S03 — Parking Logs tab renders table data @smoke', async ({ logsPage }) => {
    await logsPage.goToLogsTab();
    const count = await logsPage.readLogsCount();
    expect(count).toBeGreaterThanOrEqual(0);
    console.log(`[Smoke S03] Parking Logs today: ${count}`);
  });

  test('S04 — Summary KPIs are non-negative numbers @smoke', async ({ logsPage }) => {
    const kpis = await logsPage.getAllSummaryKpis();
    console.log(`[Smoke S04] Entered: ${kpis.entered}, Exited: ${kpis.exited}`);
    expect(kpis.entered).toBeGreaterThanOrEqual(0);
    expect(kpis.exited).toBeGreaterThanOrEqual(0);
  });

  test('S05 — Transactions page loads @smoke', async ({ txPage, psPage }) => {
    await expect(psPage).toHaveURL(/Transactions/);
  });

  test('S06 — Access Passes page loads with Issue button @smoke', async ({ apPage, psPage }) => {
    await expect(psPage).toHaveURL(/AccessPass/i);
    await expect(psPage.getByRole('button', { name: /Issue Access Pass/i }).first())
      .toBeVisible({ timeout: 10000 });
  });

  test('S07 — Valet Drivers page loads @smoke', async ({ valetPage, psPage }) => {
    await expect(psPage).toHaveURL(/ValetDrivers/);
  });

  test('S08 — Visitor filter applies without crashing @smoke', async ({ logsPage }) => {
    await logsPage.goToLogsTab();
    await logsPage.applyFilter('Visitor');
    const count = await logsPage.readLogsCount();
    expect(count).toBeGreaterThanOrEqual(0);
    await logsPage.clearFilters();
  });

});
