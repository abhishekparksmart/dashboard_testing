const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'fixtures', 'parksmart.fixture.js');
let code = fs.readFileSync(filePath, 'utf8');

const importApTypes = "const { AccessPassPage } = require('../pages/AccessPassPage');\nconst { AccessPassTypesPage } = require('../pages/AccessPassTypesPage');";
code = code.replace("const { AccessPassPage } = require('../pages/AccessPassPage');", importApTypes);

const fixtureApTypes = "apPage: async ({ psPage }, use) => {\n    // ... (This block is not being replaced entirely, just adding another fixture after it)\n  },";

// We'll just add it after apPage block using string replacement.
const apPageBlockEnd = "await use(new AccessPassPage(psPage));\n  },";
const apTypesPageFixture = `await use(new AccessPassPage(psPage));
  },

  apTypesPage: async ({ psPage }, use) => {
    const pageObj = new AccessPassTypesPage(psPage);
    await use(pageObj);
  },`;

code = code.replace(apPageBlockEnd, apTypesPageFixture);
fs.writeFileSync(filePath, code, 'utf8');
console.log('Fixed fixture');
