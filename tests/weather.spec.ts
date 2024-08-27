import { test, expect, chromium } from '@playwright/test';
test('Testing and Scraping a Public Weather Website for Addis Ababa', async ({ page }) => {
  test.setTimeout(2500_000);
  await page.  goto('https://weather.com/?Goto=Redirected');
  const searchInput = page.locator('input[id="LocationSearch_input"], input[placeholder="Search City or Zip Code"]');
  await searchInput.click();
  await searchInput.fill('Addis Ababa');
  const searchResults = page.locator('text=Addis Ababa, Ethiopia');
  await searchResults.click();  
  await page.waitForSelector('text=Addis Ababa, Ethiopia');
  const resultTitle = await page.locator('h1').innerText();
  expect(resultTitle).toContain('Addis Ababa, Ethiopia');
  const browser = await chromium.launch({ headless: false });
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  const page1 = await context1.newPage();
  await page1.goto('https://weather.com/?Goto=Redirected');
  const searchInputContext = page1.locator('input[id="LocationSearch_input"], input[placeholder="Search City or Zip Code"]');
  await searchInputContext.click();
  await searchInputContext.fill('Addis Ababa');
  const searchResultsContext = page1.locator('text=Addis Ababa, Ethiopia');
  await searchResultsContext.click();
  await page1.screenshot({ path: 'addis-ababa-weather-results.png' });
  await page1.pdf({ path: 'addis-ababa-weather-report.pdf', format: 'A4' });
  await context2.route('/api/weather/', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        location: 'Addis Ababa',
        temperature: '22°C',
        condition: 'Partly Cloudy',
      }),
    });
  });
  const temperature = await page1.locator('span[class*="CurrentConditions--tempValue"]').innerText();
  const condition = await page1.locator('div[class*="CurrentConditions--phraseValue"]').innerText();
  console.log(`Temperature: ${temperature}`);
  console.log(`Condition: ${condition}`);
  await page1.waitForTimeout(10000);
  await context1.close();
  await context2.close();
  await browser.close();
});
