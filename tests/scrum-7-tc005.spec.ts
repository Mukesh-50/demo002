import { test, expect } from '@playwright/test';

test('SCRUM-7-TC005 Verify error message for empty email and password', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page to be displayed with "Sign In" heading
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Leave email field empty
  const emailField = page.getByPlaceholder('Enter Email');
  // Expect the email field to be empty
  await expect(emailField).toHaveValue('');

  // Step 3: Leave password field empty
  const passwordField = page.getByPlaceholder('Enter Password');
  // Expect the password field to be empty
  await expect(passwordField).toHaveValue('');

  // Step 4: Click Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Expect error message 'Email and Password is required' is displayed
  await expect(page.getByText('Email and Password is required')).toBeVisible();

  // Step 5: Check authentication (user remains on login page)
  // Expect still on login page (URL unchanged)
  await expect(page).toHaveURL('https://freelance-learn-automation.vercel.app/login');
  // Expect login form is still present
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
});