const { chromium } = require('playwright');
(async () => {
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://example.com');
// Click an element
await page.click('a');
await browser.close();
})();   