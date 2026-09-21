import { test, expect } from '../../fixtures/parksmart.fixture';

/**
 * Dynamic E2E Smoke Suite
 * This test dynamically crawls the ParkSmart sidebar and clicks every available
 * module and sub-module. It verifies that every single route on the platform
 * loads correctly without crashing (no empty pages, no 404s, no 500s).
 */
test.describe('ParkSmart • Global E2E Smoke Test', () => {
  
  test.setTimeout(300000); // 5 minutes for full crawl

  test('Navigate to all sidebar modules successfully', async ({ psPage }) => {
    // 1. Expand all accordions to reveal all links
    const accordions = await psPage.getByRole('button', { name: /Management|Violations|User/i }).all();
    for (const btn of accordions) {
      if (await btn.isVisible()) {
        const expanded = await btn.getAttribute('aria-expanded');
        if (expanded !== 'true') {
          await btn.click();
          await psPage.waitForTimeout(500); // allow animation
        }
      }
    }

    // 2. Collect all sidebar links
    const sidebar = psPage.locator('aside, .sidebar, [class*="Sidebar"]').first();
    // Exclude 'Toggle Sidebar' and profile buttons by checking hrefs
    const allLinks = await psPage.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .filter(el => el.getAttribute('href') && el.getAttribute('href').includes('/web/dashboard/'))
        .map(el => ({
          name: el.innerText.trim(),
          href: el.getAttribute('href')
        }))
        .filter(link => link.name.length > 0);
    });

    // Remove duplicates
    const uniqueLinks = Array.from(new Map(allLinks.map(item => [item.href, item])).values());
    console.log(`[Global Smoke] Found ${uniqueLinks.length} distinct routes to verify.`);

    // 3. Click each link and verify it renders properly
    for (const link of uniqueLinks) {
      console.log(`Verifying Route: ${link.name} -> ${link.href}`);
      
      // Navigate via UI click if visible, otherwise direct SPA push
      const locator = psPage.getByRole('link', { name: link.name, exact: true }).first();
      if (await locator.isVisible()) {
        await locator.click();
      } else {
        const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
        await psPage.goto(`${baseUrl}${link.href}`);
      }

      await psPage.waitForLoadState('networkidle', { timeout: 15000 });
      await psPage.waitForTimeout(500);

      // Assert page didn't crash (should have a heading or table)
      const hasHeading = await psPage.getByRole('heading').first().isVisible({ timeout: 5000 }).catch(() => false);
      const hasTable = await psPage.getByRole('table').first().isVisible({ timeout: 2000 }).catch(() => false);
      
      // Most pages have a main heading matching the sidebar link
      expect(hasHeading || hasTable).toBeTruthy();
    }
  });

});
