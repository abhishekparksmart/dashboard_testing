const { test: base, expect } = require('@playwright/test');
const { TransactionsPage } = require('../pages/TransactionsPage');
const { AccessPassPage } = require('../pages/AccessPassPage');
const { ValetDriverPage } = require('../pages/ValetDriverPage');

// Extend base test to use the authenticated state
const test = base.extend({
  // Fixture: Pre-authenticated admin page
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: '.auth/admin.json' });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  // Inject Page Objects directly initialized with the authenticated page
  transactionsPage: async ({ adminPage }, use) => {
    await use(new TransactionsPage(adminPage));
  },
  
  accessPassPage: async ({ adminPage }, use) => {
    await use(new AccessPassPage(adminPage));
  },
  
  valetDriverPage: async ({ adminPage }, use) => {
    await use(new ValetDriverPage(adminPage));
  }
});

module.exports = { test, expect };
