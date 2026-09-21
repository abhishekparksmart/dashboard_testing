import { test, expect } from '../../fixtures/parksmart.fixture';

test.describe('ParkSmart Clients', () => {

  test.beforeEach(async ({ clientsPage }) => {
    await clientsPage.navigate();
  });

  test.describe('@smoke • Critical Paths', () => {
    test('Clients page loads @smoke', async ({ psPage }) => {
      await expect(psPage).toHaveURL(/Clients/i);
      await expect(psPage.getByRole('heading', { name: /Clients/i }).first()).toBeVisible();
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
    test('Search invalid text shows empty/no-data state', async ({ clientsPage, psPage }) => {
      await clientsPage.searchByName('ZZZZZ_INVALID_CLIENT_99999');
      const isEmpty = await psPage.getByText(/No Data|No results/i)
        .first().isVisible({ timeout: 5000 }).catch(() => false);
      const rowCount = await psPage.getByRole('row').count();
      expect(rowCount <= 1 || isEmpty).toBeTruthy();
    });
  });

  test.describe('Create Form • Validation', () => {
    test('Opening Create Form shows inputs', async ({ clientsPage, psPage }) => {
      await clientsPage.openCreateForm();
      const hasForm = await psPage.getByRole('heading', { name: /Create Client/i }).first()
        .isVisible({ timeout: 8000 }).catch(() => false);
      // Wait for at least one input to be visible
      const input = psPage.getByRole('textbox').first();
      await expect(input).toBeVisible({ timeout: 5000 });
    });

    test('Submitting empty form shows validation errors', async ({ clientsPage, psPage }) => {
      await clientsPage.openCreateForm();
      const submitBtn = psPage.getByRole('button', { name: /Submit|Save|Create/i }).last();
      await submitBtn.click();
      const hasError = await psPage.locator('[class*="error"], .invalid-feedback, [aria-invalid="true"]').first()
        .isVisible({ timeout: 5000 }).catch(() => false);
      const hasErrorText = await psPage.getByText(/required|invalid|Please/i).first()
        .isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasError || hasErrorText).toBeTruthy();
    });

    test('Closing the modal/form returns to list', async ({ clientsPage, psPage }) => {
      await clientsPage.openCreateForm();
      const cancelBtn = psPage.getByRole('button', { name: /Cancel|Close/i }).first();
      if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await cancelBtn.click();
        await psPage.waitForTimeout(1000);
        await expect(psPage.getByRole('button', { name: /Create Client/i }).first()).toBeVisible();
      }
    });
  });

});
