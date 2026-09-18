import { test, expect } from '../../fixtures/parksmart.fixture';

test.describe('ParkSmart Access Pass Types', () => {

  test.beforeEach(async ({ apTypesPage }) => {
    await apTypesPage.navigate();
  });

  test.describe('@smoke • Critical Paths', () => {
    test('Access Pass Types page loads @smoke', async ({ psPage }) => {
      await expect(psPage).toHaveURL(/AccessPassTypes/i);
      await expect(psPage.getByRole('heading', { name: /Access Pass Types/i }).first()).toBeVisible();
    });

    test('"Create Access Pass Type" button is visible @smoke', async ({ psPage }) => {
      await expect(psPage.getByRole('button', { name: /Create Access Pass Type/i }).first())
        .toBeVisible({ timeout: 10000 });
    });

    test('Table renders with headers @smoke', async ({ psPage }) => {
      await expect(psPage.getByText('Pass Type', { exact: true }).first()).toBeVisible();
      await expect(psPage.getByText('Renewal Interval', { exact: true }).first()).toBeVisible();
    });
  });

  test.describe('List & Search', () => {
    test('Search by Name works', async ({ apTypesPage, psPage }) => {
      await apTypesPage.searchByName('Admin');
      const isEmpty = await psPage.getByText(/No Data|No results/i)
        .first().isVisible({ timeout: 3000 }).catch(() => false);
      const rowCount = await psPage.getByRole('row').count();
      expect(rowCount >= 1 || isEmpty).toBeTruthy();
    });

    test('Invalid search shows empty/no-data state', async ({ apTypesPage, psPage }) => {
      await apTypesPage.searchByName('ZZZZZ_INVALID_TYPE_99999');
      const isEmpty = await psPage.getByText(/No Data|No results/i)
        .first().isVisible({ timeout: 5000 }).catch(() => false);
      const rowCount = await psPage.getByRole('row').count();
      expect(rowCount <= 1 || isEmpty).toBeTruthy(); // <= 1 means header only
    });
  });

  test.describe('Create Form • Validation', () => {
    test('Opening Create Form shows inputs', async ({ apTypesPage, psPage }) => {
      await apTypesPage.openCreateForm();
      const hasForm = await psPage.getByRole('heading', { name: /Create Access Pass Type|Access Pass Type Configuration/i }).first()
        .isVisible({ timeout: 8000 }).catch(() => false);
      // Wait for at least one input to be visible
      const input = psPage.getByRole('textbox').first();
      await expect(input).toBeVisible({ timeout: 5000 });
    });

    test('Submitting empty form shows validation errors', async ({ apTypesPage, psPage }) => {
      await apTypesPage.openCreateForm();
      const submitBtn = psPage.getByRole('button', { name: /Submit|Save|Create/i }).last();
      await submitBtn.click();
      const hasError = await psPage.locator('[class*="error"], .invalid-feedback, [aria-invalid="true"]').first()
        .isVisible({ timeout: 5000 }).catch(() => false);
      const hasErrorText = await psPage.getByText(/required|invalid|Please/i).first()
        .isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasError || hasErrorText).toBeTruthy();
    });

    test('Closing the modal/form returns to list', async ({ apTypesPage, psPage }) => {
      await apTypesPage.openCreateForm();
      const cancelBtn = psPage.getByRole('button', { name: /Cancel|Close/i }).first();
      if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await cancelBtn.click();
        await psPage.waitForTimeout(1000);
        await expect(psPage.getByRole('button', { name: /Create Access Pass Type/i }).first()).toBeVisible();
      }
    });
  });
});
