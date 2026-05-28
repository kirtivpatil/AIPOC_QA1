import { test, expect } from '@playwright/test';

test('Purchase Blackberry and verify success with screenshot', async ({ page }) => {
  // Step 1: Navigate to the login page
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  // Step 2: Sign in
  await page.locator('#username').fill('rahulshettyacademy');
  await page.locator('#password').fill('Learning@830$3mK2');
  await page.locator('#signInBtn').click();

  // Step 3: Wait for shop page to load
  await page.waitForURL('**/angularpractice/shop');

  // Step 4: Select and add Blackberry product to cart
  await page.locator('app-card').filter({ hasText: 'Blackberry' }).getByRole('button', { name: 'Add' }).click();

  // Step 5: Navigate to cart via the top nav Checkout link
  await page.locator('a.nav-link.btn.btn-primary').click();

  // Step 6: Verify Blackberry is in the cart
  const cartItem = page.locator('div.media-body').filter({ hasText: 'Blackberry' });
  await expect(cartItem).toBeVisible({ timeout: 10000 });
  console.log('✅ Blackberry is present in the cart');

  // Step 7: Proceed to checkout form
  await page.locator('button.btn-success').click();

  // Step 8: Enter Delivery location as India
  await page.locator('#country').type('India', { delay: 100 });
  await page.waitForSelector('.suggestions ul li', { state: 'visible' });
  await page.locator('.suggestions ul li').first().click();

  // Step 9: Accept terms & conditions
  await page.locator('label[for="checkbox2"]').click();
  await expect(page.locator('#checkbox2')).toBeChecked();

  // Step 10: Purchase - Submit the order
  await page.locator('input[type="submit"]').click();

  // Step 11: Verify Success message
  const successMsg = page.locator('.alert-success');
  await expect(successMsg).toBeVisible();
  const successText = await successMsg.innerText();
  console.log('✅ Order placed successfully! Message:', successText);
  
  // Verify the success message contains expected text
  expect(successText).toContain('Success!');

  // Step 12: Take screenshot and save it in tests/screenshot folder
  await page.screenshot({ path: 'tests/screenshot/purchase-success.png', fullPage: true });
  console.log('✅ Screenshot saved to tests/screenshot/purchase-success.png');
});
