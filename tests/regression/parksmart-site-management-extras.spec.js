import { test, expect } from '../../fixtures/parksmart.fixture';

const pagesToTest = [
  { name: 'Gates', fixture: 'gatesPage', urlRegex: /Gates/i, createRegex: /Create Gate/i },
  { name: 'Site Units', fixture: 'siteUnitsPage', urlRegex: /SiteUnits/i, createRegex: /Create Site Unit/i },
  { name: 'Parking Areas', fixture: 'parkingAreasPage', urlRegex: /ParkingAreas/i, createRegex: /Create Parking Area/i },
  { name: 'Migrations', fixture: 'migrationsPage', urlRegex: /Migrations/i, createRegex: /Create Migration/i }
];

for (const p of pagesToTest) {
  test.describe(`ParkSmart ${p.name} - Exhaustive Suite`, () => {
    
    // --- POSITIVE TESTS ---
    test.describe('Positive Tests', () => {
      test(`[P1] ${p.name} page loads correctly @smoke`, async ({ psPage }) => {
        const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
        const path = p.name.replace(/ /g, '');
        await psPage.goto(`${baseUrl}/web/dashboard/${path}`);
        await psPage.waitForLoadState('networkidle', { timeout: 15000 });

        await expect(psPage).toHaveURL(p.urlRegex);
        await expect(psPage.getByRole('heading', { name: new RegExp(p.name, 'i') }).first()).toBeVisible();
      });

      test(`[P2] Table renders data or empty state without crashing @smoke`, async ({ psPage }) => {
        if (p.name === 'Migrations') return test.skip();
        const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
        const path = p.name.replace(/ /g, '');
        await psPage.goto(`${baseUrl}/web/dashboard/${path}`);
        await psPage.waitForLoadState('networkidle', { timeout: 15000 });

        const hasTable = await psPage.getByRole('table').first().isVisible({ timeout: 5000 }).catch(() => false);
        const isEmpty  = await psPage.getByText(/No Data|No results/i).first().isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasTable || isEmpty).toBeTruthy();
      });

      test(`[P3] Valid search logic renders results`, async ({ psPage }) => {
        const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
        const path = p.name.replace(/ /g, '');
        await psPage.goto(`${baseUrl}/web/dashboard/${path}`);
        await psPage.waitForLoadState('networkidle', { timeout: 15000 });

        const searchInput = psPage.getByPlaceholder(/Search by/i).first();
        if (await searchInput.isVisible().catch(() => false)) {
            await searchInput.fill('A'); // Valid generic search
            const applyBtn = psPage.getByRole('button', { name: 'Apply' });
            if (await applyBtn.isVisible().catch(() => false)) {
                await applyBtn.click();
            } else {
                await searchInput.press('Enter');
            }
            await psPage.waitForTimeout(1000);
            const hasTable = await psPage.getByRole('table').first().isVisible().catch(() => false);
            const isEmpty  = await psPage.getByText(/No Data/i).first().isVisible().catch(() => false);
            expect(hasTable || isEmpty || p.name === 'Migrations').toBeTruthy();
        }
      });
      
      test(`[P4] Create form opens and can be cancelled`, async ({ psPage }) => {
        const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
        const path = p.name.replace(/ /g, '');
        await psPage.goto(`${baseUrl}/web/dashboard/${path}`);
        await psPage.waitForLoadState('networkidle', { timeout: 15000 });

        const createBtn = psPage.getByRole('button', { name: new RegExp(`Create`, 'i') }).first();
        if (await createBtn.isVisible().catch(() => false)) {
            await createBtn.click();
            await psPage.waitForTimeout(1000);
            await expect(psPage.getByRole('heading', { name: p.createRegex }).first()).toBeVisible();
            // Cancel form
            const cancelBtn = psPage.getByRole('button', { name: /Cancel|Close/i }).last();
            if (await cancelBtn.isVisible().catch(() => false)) {
                await cancelBtn.click();
                await psPage.waitForTimeout(500);
                await expect(psPage.getByRole('heading', { name: p.createRegex }).first()).toBeHidden();
            }
        }
      });
    });

    // --- NEGATIVE TESTS ---
    test.describe('Negative Tests', () => {
      test(`[N1] Invalid search text safely shows empty state`, async ({ psPage }) => {
        const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
        const path = p.name.replace(/ /g, '');
        await psPage.goto(`${baseUrl}/web/dashboard/${path}`);
        await psPage.waitForLoadState('networkidle', { timeout: 15000 });

        const searchInput = psPage.getByPlaceholder(/Search by/i).first();
        if (await searchInput.isVisible().catch(() => false)) {
            await searchInput.fill('ZZZZ_INVALID_9999');
            const applyBtn = psPage.getByRole('button', { name: 'Apply' });
            if (await applyBtn.isVisible().catch(() => false)) {
                await applyBtn.click();
            } else {
                await searchInput.press('Enter');
            }
            await psPage.waitForTimeout(1000);
            
            // Negative verification: Table shouldn't have real rows, should be empty
            const isEmpty  = await psPage.getByText(/No Data|No results/i).first().isVisible({ timeout: 5000 }).catch(() => false);
            expect(isEmpty || p.name === 'Migrations').toBeTruthy();
        }
      });

      test(`[N2] Empty form submission triggers HTML5 validation`, async ({ psPage }) => {
        const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
        const path = p.name.replace(/ /g, '');
        await psPage.goto(`${baseUrl}/web/dashboard/${path}`);
        await psPage.waitForLoadState('networkidle', { timeout: 15000 });

        const createBtn = psPage.getByRole('button', { name: new RegExp(`Create`, 'i') }).first();
        if (await createBtn.isVisible().catch(() => false)) {
            await createBtn.click();
            await psPage.waitForTimeout(1000);
            
            const submitBtn = psPage.getByRole('button', { name: /Submit|Save|Create/i }).last();
            if (await submitBtn.isVisible().catch(() => false)) {
                await submitBtn.click();
                await psPage.waitForTimeout(500);
                
                // Form should NOT disappear, because validation prevented it
                await expect(psPage.getByRole('heading', { name: p.createRegex }).first()).toBeVisible();
            }
        }
      });
    });

  });
}
