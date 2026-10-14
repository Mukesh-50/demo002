import { test, expect } from '@playwright/test';

test('TC_LOGOUT_004 Verify a logged-in user can sign out', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the "Sign in" button to be visible on the login page
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

  // Step 2: Enter valid email address
  await page.getByPlaceholder('Enter email').fill('admin@email.com');
  // Expect the email field to have the entered value
  await expect(page.getByPlaceholder('Enter email')).toHaveValue('admin@email.com');

  // Step 3: Enter valid password
  await page.getByPlaceholder('Enter password').fill('admin@123');
  // Expect the password field to have the entered value
  await expect(page.getByPlaceholder('Enter password')).toHaveValue('admin@123');

  // Step 4: Click the Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Expect the "Sign out" button to be visible after login
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  // Step 5: Click the menu icon (it's an image, not a button)
  await page.getByRole('img', { name: 'menu' }).click();
  // Expect the menu to be open (Sign out button visible in menu)
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  // Step 6: Click the "Sign out" button
  await page.getByRole('button', { name: 'Sign out' }).click();
  // Expect user to be signed out

  // Step 7: Verify user is on login page
  await expect(page).toHaveURL(/login/);
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});
