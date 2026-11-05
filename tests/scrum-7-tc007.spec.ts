import { test, expect } from '@playwright/test';

test('SCRUM-7-TC007 Verify password field masks input while typing', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the "Sign In" heading to be visible
  await expect(page.getByRole('heading', { name: 'Sign In', level: 2 })).toBeVisible();
  // Expect the "Enter Email" textbox to be visible
  await expect(page.getByPlaceholder('Enter Email')).toBeVisible();
  // Expect the "Enter Password" textbox to be visible
  await expect(page.getByPlaceholder('Enter Password')).toBeVisible();
  // Expect the "Sign in" button to be visible
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

  // Step 2: Enter password
  await page.getByPlaceholder('Enter Password').fill('admin@123');
  // Expect the password field to have type="password" to ensure masking
  const passwordInput = await page.getByPlaceholder('Enter Password');
  await expect(passwordInput).toHaveAttribute('type', 'password');
});