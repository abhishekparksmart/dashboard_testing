import { test, expect } from '../../fixtures/parksmart.fixture';

test.describe('ParkSmart Access Pass Requests', () => {

  test.beforeEach(async ({ apRequestsPage }) => {
    await apRequestsPage.navigate();
  });

  test.describe('@smoke • Critical Paths', () => {
    test('Access Pass Requests page loads @smoke', async ({ psPage }) => {
      await expect(psPage).toHaveURL(/AccessPassRequests/i);
      await expect(psPage.getByRole('heading', { name: /Access Pass Requests/i }).first()).toBeVisible();
    });

    test('Table renders correctly @smoke', async ({ psPage }) => {
      const hasTable = await psPage.getByRole('table').first()
        .isVisible({ timeout: 5000 }).catch(() => false);
      const isEmpty  = await psPage.getByText(/No Data|No results/i)
        .first().isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasTable || isEmpty).toBeTruthy();
    });
  });

  test.describe('List & Search', () => {
    test('Search invalid text shows empty/no-data state', async ({ apRequestsPage, psPage }) => {
      await apRequestsPage.searchBy('ZZZZZ_INVALID_REQ_99999');
      const isEmpty = await psPage.getByText(/No Data|No results/i)
        .first().isVisible({ timeout: 5000 }).catch(() => false);
      const rowCount = await psPage.getByRole('row').count();
      expect(rowCount <= 1 || isEmpty).toBeTruthy(); // <= 1 means header only
    });
  });
});
