class Sidebar {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async navigateTo(menuName, subMenuName = null) {
    const menuLink = this.page.getByRole('link', { name: new RegExp(subMenuName || menuName, 'i') }).first();
    // 1. If there's a subMenuName, it means the menuName is a parent menu that might need expansion
    if (subMenuName) {
      const menuButton = this.page.getByRole('button', { name: new RegExp(menuName, 'i') }).first();
      if (await menuButton.count() > 0) {
        if (await menuButton.isVisible()) {
          const isExpanded = await menuButton.getAttribute('aria-expanded') === 'true';
          if (!isExpanded) {
            await menuButton.click();
            await this.page.waitForTimeout(500); // Wait for expansion animation
          }
        }
      }
    }
    
    // 2. Click the actual navigation link
    if (await menuLink.count() > 0) {
      await menuLink.waitFor({ state: 'visible', timeout: 5000 });
      await menuLink.click();
    }
    
    await this.page.waitForTimeout(1000); // Wait for page load
  }
}

module.exports = { Sidebar };
