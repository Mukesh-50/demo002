import { test, expect } from '@playwright/test';

test('SCRUM-7-TC004 Verify error message for empty password', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page heading "Sign In" to be visible
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Enter email
  await page.getByPlaceholder('Enter Email').fill('admin@email.com');
  // Expect the email field to contain the entered value
  await expect(page.getByPlaceholder('Enter Email')).toHaveValue('admin@email.com');

  // Step 3: Leave password field empty
  // Expect the password field to be empty
  await expect(page.getByPlaceholder('Enter Password')).toHaveValue('');

  // Step 4: Click Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Expect error message "Password is required" to be displayed
  await expect(page.getByText('Password is required')).toBeVisible();

  // Step 5: Check authentication
  // Expect the user to remain on the login page (heading "Sign In" still visible)
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  // Optionally, ensure URL has not changed
  await expect(page).toHaveURL('https://freelance-learn-automation.vercel.app/login');
});