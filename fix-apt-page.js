const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pages', 'AccessPassTypesPage.js');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  "await this.page.waitForLoadState('networkidle', { timeout: 10000 });",
  "await this.page.waitForTimeout(2000);\n    await this.page.waitForLoadState('networkidle', { timeout: 10000 });"
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Fixed page object wait');
