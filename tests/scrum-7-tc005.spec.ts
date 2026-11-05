import { test, expect } from '@playwright/test';

test('SCRUM-7-TC005 Verify error message for empty email and password', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page to be displayed by checking for the "Sign In" heading
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Leave email field empty
  // Email field with placeholder "Enter Email" should be empty by default
  const emailInput = page.getByPlaceholder('Enter Email');
  await expect(emailInput).toBeVisible();
  await expect(emailInput).toHaveValue('');

  // Step 3: Leave password field empty
  // Password field with placeholder "Enter Password" should be empty by default
  const passwordInput = page.getByPlaceholder('Enter Password');
  await expect(passwordInput).toBeVisible();
  await expect(passwordInput).toHaveValue('');

  // Step 4: Click Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Expect error message 'Email and Password is required' to be displayed as a heading
  await expect(page.getByRole('heading', { level: 2, name: /Email and Password is required/ })).toBeVisible();

  // Expect the user is not authenticated (still on the login page)
  await expect(page).toHaveURL('https://freelance-learn-automation.vercel.app/login');
});