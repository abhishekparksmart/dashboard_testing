const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://parksmart.io/web/auth/login');
  
  try {
    await page.waitForTimeout(5000); // Wait 5 seconds for any SPA rendering
    const content = await page.content();
    console.log("PAGE TITLE:", await page.title());
    if (content.includes('Email / Username')) {
      console.log("Found 'Email / Username' text on page.");
    } else {
      console.log("Did NOT find 'Email / Username' text on page.");
    }
    
    // Check if there are any inputs
    const inputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input')).map(el => ({
        type: el.type,
        placeholder: el.placeholder,
        name: el.name,
        id: el.id
      }));
    });
    console.log("Inputs found:", inputs);
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();
