const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tests', 'regression', 'parksmart-access-types.spec.js');
let code = fs.readFileSync(filePath, 'utf8');

// Fix the header locators
code = code.replace(
  "await expect(psPage.getByRole('columnheader', { name: /Pass Type/i }).first()).toBeVisible();",
  "await expect(psPage.getByText('Pass Type', { exact: true }).first()).toBeVisible();"
);
code = code.replace(
  "await expect(psPage.getByRole('columnheader', { name: /Renewal Interval/i }).first()).toBeVisible();",
  "await expect(psPage.getByText('Renewal Interval', { exact: true }).first()).toBeVisible();"
);

// We'll also just add a sleep in the search action, but since it's in the Page Object, we'll fix the Page object.
fs.writeFileSync(filePath, code, 'utf8');
console.log('Fixed test file headers');
