import { test, expect } from '@playwright/test';

test('SCRUM-7-TC007 Verify password is masked while typing', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page to be displayed with "Sign In" heading
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  // Expect the password field with placeholder "Enter Password" to be visible
  const passwordField = page.getByPlaceholder('Enter Password');
  await expect(passwordField).toBeVisible();

  // Step 2: Enter password
  await passwordField.fill('admin@123');
  // Expect the password field to have the entered value
  await expect(passwordField).toHaveValue('admin@123');
  // Expect the password field to have input type "password" (masked)
  await expect(passwordField).toHaveAttribute('type', 'password');
});