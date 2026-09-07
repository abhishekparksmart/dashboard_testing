# Enterprise Playwright Framework

This repository houses the scalable, enterprise-grade automated testing framework for the ParkSmart SaaS application.

## 🏗 Architecture
This framework strictly follows the **Page Object Model (POM)** and **Component Object Model (COM)** design patterns.
- **Pages (`pages/`)**: Contain ONLY locators, actions, and validations. No assertions are allowed in Page classes.
- **Components (`components/`)**: Reusable UI blocks like Sidebar, Table, and Search.
- **Fixtures (`fixtures/`)**: Global setup routines inject pre-authenticated contexts (`adminPage`) into tests to bypass repetitive UI logins.
- **API (`api/`)**: Built-in wrappers for API-assisted test setup and teardown.

## 🚀 Installation
```bash
npm install
npx playwright install
```

## ⚙️ Environment Setup
Environment variables are managed in `.env.[env]` files (`.env.dev`, `.env.qa`, `.env.prod`).
By default, the framework loads `dev`. To run tests against QA:
```bash
TEST_ENV=qa npx playwright test
```

## 🏃 Execution Commands
- **All tests (Chromium)**: `npx playwright test --project=chromium`
- **Smoke tests**: `npx playwright test --grep @smoke`
- **Specific test file**: `npx playwright test tests/e2e/master-flow.spec.js`
- **UI Mode**: `npx playwright test --ui`

## 📊 Reporting
The framework generates **HTML**, **Allure**, and **JUnit** reports.
Screenshots, Videos, and Traces are automatically captured on test failure.

To view the Allure report:
```bash
npx allure generate reports/allure-results -o reports/allure-report --clean
npx allure open reports/allure-report
```

## 🛠 Best Practices (Coding Standards)
1. **No `waitForTimeout()`**: Use Playwright's auto-waiting or explicit waits like `waitForLoadState('networkidle')`.
2. **No Duplicated Login**: Use `fixtures/auth.fixture.js` (e.g. `test('My test', async ({ adminPage }) => {})`) to start your test already authenticated.
3. **Use Soft Assertions**: Use `expect.soft()` to allow tests to continue after non-critical failures.
4. **Short Methods**: Keep methods under 30 lines. Follow SOLID principles.
5. **No Hardcoded Data**: Use dynamic generation (`utils/random.js`) or data files (`test-data/`).
