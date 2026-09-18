const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'pages', 'AccessPassPage.js');
let code = fs.readFileSync(filePath, 'utf8');

const oldNav = `  async navigateToAccessPasses() {
    const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
    await this.page.goto(\`\${baseUrl}/web/dashboard/AccessPasses\`);
    await this.page.waitForLoadState('networkidle');
  }`;

const newNav = `  async navigateToAccessPasses() {
    const baseUrl = process.env.BASE_URL || 'https://web.parksmart.io';
    const currentUrl = this.page.url();
    if (!currentUrl.includes(baseUrl)) {
      await this.page.goto(\`\${baseUrl}/web/dashboard\`);
      await this.page.waitForLoadState('networkidle', { timeout: 20000 });
    }
    if (/\\/web\\/dashboard\\/AccessPasses/.test(this.page.url())) {
      return;
    }
    const mgmtBtn = this.page.getByRole('button', { name: /Access Manage/i }).first();
    if (await mgmtBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      const expanded = await mgmtBtn.getAttribute('aria-expanded');
      if (expanded !== 'true') await mgmtBtn.click();
    }
    const link = this.page.getByRole('link', { name: /Access Pass/i }).first();
    await link.click();
    await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    await this.page.waitForTimeout(2000);
  }`;

code = code.replace(oldNav, newNav);
fs.writeFileSync(filePath, code, 'utf8');
console.log('Fixed nav');
