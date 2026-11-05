import { test, expect } from '@playwright/test';

test('SCRUM-7-TC004 Verify error message for empty password', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page to be displayed with "Sign In" heading
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Enter email
  await page.getByPlaceholder('Enter Email').fill('admin@email.com');
  // Expect the email field contains entered value
  await expect(page.getByPlaceholder('Enter Email')).toHaveValue('admin@email.com');

  // Step 3: Leave password field empty
  // (Do not fill password field)
  // Expect the password field is empty
  await expect(page.getByPlaceholder('Enter Password')).toHaveValue('');

  // Step 4: Click Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Expect error message 'Password is required' is displayed
  await expect(page.getByText('Password is required')).toBeVisible();
  // Expect user is not authenticated (still on login page)
  await expect(page).toHaveURL('https://freelance-learn-automation.vercel.app/login');
});