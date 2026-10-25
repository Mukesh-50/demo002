import { test, expect } from '@playwright/test';

test('SCRUM-7-TC005 Verify error message for empty email and password', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page heading "Sign In" to be visible
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Leave email field empty
  // Expect the email field with placeholder "Enter Email" to be empty
  await expect(page.getByPlaceholder('Enter Email')).toHaveValue('');

  // Step 3: Leave password field empty
  // Expect the password field with placeholder "Enter Password" to be empty
  await expect(page.getByPlaceholder('Enter Password')).toHaveValue('');

  // Step 4: Click Sign in
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Expect error message heading "error Email and Password is required" to be visible
  await expect(page.getByRole('heading', { level: 2, name: /Email and Password is required/ })).toBeVisible();
  // Expect the error message text "Email and Password is required" to be visible
  await expect(page.getByText('Email and Password is required')).toBeVisible();
  // Expect the user to remain on the login page (URL unchanged)
  await expect(page).toHaveURL('https://freelance-learn-automation.vercel.app/login');
});