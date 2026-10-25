import { test, expect } from '@playwright/test';

test('SCRUM-7-TC003 Verify error message for empty email', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page to be displayed by checking for the "Sign In" heading
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Leave email field empty
  // Ensure the email field is empty
  const emailField = page.getByPlaceholder('Enter Email');
  await expect(emailField).toBeVisible();
  await expect(emailField).toHaveValue('');

  // Step 3: Enter password
  const passwordField = page.getByPlaceholder('Enter Password');
  await passwordField.fill('admin@123456');
  // Expect the password field to contain the entered value (masked)
  await expect(passwordField).toHaveValue('admin@123456');

  // Step 4: Click Sign in
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Expect error message heading "error Email is required" (level 2) to be visible
  await expect(page.getByRole('heading', { level: 2, name: /Email is required/i })).toBeVisible();
  // Expect error message text "Email is required" to be visible
  await expect(page.getByText('Email is required')).toBeVisible();
  // Expect user is not authenticated by checking that we remain on the login page
  await expect(page).toHaveURL('https://freelance-learn-automation.vercel.app/login');
});