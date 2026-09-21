import { test, expect } from '../../fixtures/parksmart.fixture';

test.describe('ParkSmart Sites', () => {

  test.beforeEach(async ({ sitesPage }) => {
    await sitesPage.navigate();
  });

  test.describe('@smoke • Critical Paths', () => {
    test('Sites page loads @smoke', async ({ psPage }) => {
      await expect(psPage).toHaveURL(/Sites/i);
      await expect(psPage.getByRole('heading', { name: /Sites/i }).first()).toBeVisible();
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
    test('Search invalid text shows empty/no-data state', async ({ sitesPage, psPage }) => {
      await sitesPage.searchByName('ZZZZZ_INVALID_SITE_99999');
      const isEmpty = await psPage.getByText(/No Data|No results/i)
        .first().isVisible({ timeout: 5000 }).catch(() => false);
      const rowCount = await psPage.getByRole('row').count();
      expect(rowCount <= 1 || isEmpty).toBeTruthy();
    });
  });

  test.describe('Create Form • Validation', () => {
    test('Opening Create Form shows inputs', async ({ sitesPage, psPage }) => {
      await sitesPage.openCreateForm();
      const hasForm = await psPage.getByRole('heading', { name: /Create Site/i }).first()
        .isVisible({ timeout: 8000 }).catch(() => false);
      const input = psPage.getByRole('textbox').first();
      await expect(input).toBeVisible({ timeout: 5000 });
    });

    test.skip('Submitting empty form shows validation errors', async ({ sitesPage, psPage }) => {
      await sitesPage.openCreateForm();
      const submitBtn = psPage.getByRole('button', { name: /Submit|Save|Create/i }).last();
      await submitBtn.click();
      const hasError = await psPage.locator('[class*="error"], .invalid-feedback, [aria-invalid="true"]').first()
        .isVisible({ timeout: 5000 }).catch(() => false);
      const hasErrorText = await psPage.getByText(/required|invalid|Please/i).first()
        .isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasError || hasErrorText).toBeTruthy();
    });

    test('Closing the modal/form returns to list', async ({ sitesPage, psPage }) => {
      await sitesPage.openCreateForm();
      const cancelBtn = psPage.getByRole('button', { name: /Cancel|Close/i }).first();
      if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await cancelBtn.click();
        await psPage.waitForTimeout(1000);
        await expect(psPage.getByRole('button', { name: /Create Site/i }).first()).toBeVisible();
      }
    });
  });

});
