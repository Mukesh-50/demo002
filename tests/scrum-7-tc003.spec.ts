import { test, expect } from '@playwright/test';

test('SCRUM-7-TC003 Verify error message for empty email', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page to be displayed by checking for the "Sign In" heading
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Leave email field empty
  // Ensure the "Enter Email" field is empty
  const emailField = page.getByPlaceholder('Enter Email');
  await expect(emailField).toBeVisible();
  await expect(emailField).toHaveValue('');

  // Step 3: Enter password
  const passwordField = page.getByPlaceholder('Enter Password');
  await expect(passwordField).toBeVisible();
  await passwordField.fill('admin@123456');
  // Expect the password field to contain the entered value (masked)
  await expect(passwordField).toHaveValue('admin@123456');

  // Step 4: Click Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Expect error message 'Email is required' to be displayed
  await expect(page.getByText('Email is required')).toBeVisible();
  // Expect user is not authenticated (still on login page)
  await expect(page).toHaveURL('https://freelance-learn-automation.vercel.app/login');
});