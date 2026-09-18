const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tests', 'regression', 'parksmart-access-pass.spec.js');
let code = fs.readFileSync(filePath, 'utf8');

const oldSearch = `          await searchBox.fill('ZZZZZ_INVALID_PASS_99999');
          await searchBox.press('Enter');`;

const newSearch = `          await searchBox.fill('ZZZZZ_INVALID_PASS_99999');
          const applyBtn = psPage.getByRole('button', { name: 'Apply' }).first();
          if (await applyBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await applyBtn.click();
          } else {
            await searchBox.press('Enter');
          }`;

code = code.replace(oldSearch, newSearch);

const oldSearchValid = `          await searchInput.fill('9999');
          await searchInput.press('Enter');`;

const newSearchValid = `          await searchInput.fill('9999');
          const applyBtn = psPage.getByRole('button', { name: 'Apply' }).first();
          if (await applyBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await applyBtn.click();
          } else {
            await searchInput.press('Enter');
          }`;

code = code.replace(oldSearchValid, newSearchValid);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Fixed search');
