import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('Login, add iPhone X to cart, checkout and verify order', async ({ page }) => {
  // Ensure screenshots folder exists
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Step 1: Navigate to login page
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  // Step 2: Sign in
  await page.locator('#username').fill('rahulshettyacademy');
  await page.locator('#password').fill('Learning@830$3mK2');
  await page.locator('#signInBtn').click();

  // Step 3: Wait for shop page
  await page.waitForURL('**/angularpractice/shop');

  // Step 4: Add iPhone X to cart
  await page.locator('app-card').filter({ hasText: 'iphone X' }).getByRole('button', { name: 'Add' }).click();

  // Step 5: Navigate to cart
  await page.locator('a.nav-link.btn.btn-primary').click();

  // Step 6: Verify iPhone X is in the cart
  const cartItem = page.locator('div.media-body').filter({ hasText: 'iphone X' });
  await expect(cartItem).toBeVisible({ timeout: 10000 });
  console.log('✅ iPhone X is present in the cart');

  // Step 7: Proceed to checkout
  await page.locator('button.btn-success').click();

  // Step 8: Fill delivery location as India
  await page.locator('#country').type('India', { delay: 100 });
  await page.waitForSelector('.suggestions ul li', { state: 'visible' });
  await page.locator('.suggestions ul li').first().click();

  // Step 9: Accept terms & conditions
  await page.locator('label[for="checkbox2"]').click();
  await expect(page.locator('#checkbox2')).toBeChecked();

  // Step 10: Submit the order
  await page.locator('input[type="submit"]').click();

  // Step 11: Verify success message
  const successMsg = page.locator('.alert-success');
  await expect(successMsg).toBeVisible({ timeout: 10000 });
  console.log('✅ Order placed successfully! Message:', await successMsg.innerText());

  // Step 12: Take screenshot and save to tests/screenshots
  const screenshotPath = path.join(screenshotsDir, 'iphoneX-order-success.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`📸 Screenshot saved to: ${screenshotPath}`);
});
