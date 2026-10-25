import { test, expect } from '@playwright/test';

test('SCRUM-7-TC004 Verify error message for empty password', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Enter email
  await page.getByPlaceholder('Enter Email').fill('admin@email.com');
  await expect(page.getByPlaceholder('Enter Email')).toHaveValue('admin@email.com');

  // Step 3: Leave password field empty
  await expect(page.getByPlaceholder('Enter Password')).toHaveValue('');

  // Step 4: Click Sign in
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { level: 2, name: /error Password is required/i })).toBeVisible();
  await expect(page.getByText('Password is required')).toBeVisible();
  await expect(page).toHaveURL('https://freelance-learn-automation.vercel.app/login');
});