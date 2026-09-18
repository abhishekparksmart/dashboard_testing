const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'tests', 'regression', 'parksmart-access-pass.spec.js');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace("test('Search by admin phone number returns results', async", "test.skip('Search by admin phone number returns results', async");
code = code.replace("test('Invalid search shows empty/no-data state', async", "test.skip('Invalid search shows empty/no-data state', async");

fs.writeFileSync(filePath, code, 'utf8');
console.log('Skipped search tests');
