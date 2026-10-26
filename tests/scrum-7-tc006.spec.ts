import { test, expect } from '@playwright/test';

test('SCRUM-7-TC006 Verify navigation menu for authenticated user', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page to be displayed with "Sign In" heading
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Enter email
  await page.getByRole('textbox', { name: /email/i }).fill('admin@email.com');
  // Expect the email field contains entered value
  await expect(page.getByRole('textbox', { name: /email/i })).toHaveValue('admin@email.com');

  // Step 3: Enter password
  await page.getByRole('textbox', { name: /password/i }).fill('admin@123');
  // Expect the password field contains entered value (masked)
  await expect(page.getByRole('textbox', { name: /password/i })).toHaveValue('admin@123');

  // Step 4: Click Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Expect redirected to home page with welcome message
  await expect(page.getByText('Welcome Admin Manager to Learn Automation Courses')).toBeVisible();

  // Step 5: Open navigation menu
  await page.getByRole('img', { name: 'menu' }).click();
  // Expect navigation menu is displayed (Sign out button should be visible)
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  // Step 6: Check for Sign out option
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  // Step 7: Check for Log in option
  await expect(page.getByRole('button', { name: 'Log in' })).not.toBeVisible();
});