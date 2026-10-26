import { test, expect } from '@playwright/test';

test('SCRUM-7-TC007 Verify password is masked while typing', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the "Sign In" heading to be visible
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  // Expect the email textbox with placeholder "Enter Email" to be visible
  await expect(page.getByPlaceholder('Enter Email')).toBeVisible();
  // Expect the password textbox with placeholder "Enter Password" to be visible
  await expect(page.getByPlaceholder('Enter Password')).toBeVisible();
  // Expect the "Sign in" button to be visible
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

  // Step 2: Enter password
  await page.getByPlaceholder('Enter Password').fill('admin@123');
  // Expect the password field to have the entered value
  await expect(page.getByPlaceholder('Enter Password')).toHaveValue('admin@123');
  // Expect the password field to have type "password" (masked input)
  await expect(page.getByPlaceholder('Enter Password')).toHaveAttribute('type', 'password');
});