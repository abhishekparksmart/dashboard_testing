import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  
  // Set global setup for authentication state
  globalSetup: require.resolve('./config/global-setup'),
  globalTeardown: require.resolve('./config/global-teardown'),

  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['junit', { outputFile: 'reports/results.xml' }],
    ['allure-playwright', { detail: true, outputFolder: 'reports/allure-results', suiteTitle: false }]
  ],

  use: {
    storageState: '.auth/admin.json',
    // We rely on .env configuration, so no hardcoded baseURL here
    // baseURL: process.env.BASE_URL,
    
    // Automatically capture screenshots on failure, and retain videos/traces
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Default timeouts
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
