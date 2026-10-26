import { test, expect } from '@playwright/test';

test('SCRUM-7-TC007 Verify password field masks input while typing', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page to be displayed with "Sign In" heading
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Click on password field
  const passwordField = page.getByPlaceholder('Enter Password');
  await passwordField.click();
  // Expect the password field to be focused
  await expect(passwordField).toBeFocused();

  // Step 3: Enter password
  await passwordField.fill('admin@123');
  // Expect the password field to have the entered value
  await expect(passwordField).toHaveValue('admin@123');
  // Expect the password field to have type 'password' (masking input)
  await expect(passwordField).toHaveAttribute('type', 'password');
});