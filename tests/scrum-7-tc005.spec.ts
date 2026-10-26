import { test, expect } from '@playwright/test';

test('SCRUM-7-TC005 Verify error message for empty email and password', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Leave email field empty
  const emailField = page.getByPlaceholder('Enter Email');
  await expect(emailField).toBeVisible();
  await expect(emailField).toHaveValue('');

  // Step 3: Leave password field empty
  const passwordField = page.getByPlaceholder('Enter Password');
  await expect(passwordField).toBeVisible();
  await expect(passwordField).toHaveValue('');

  // Step 4: Click Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { level: 2, name: 'Email and Password is required' })).toBeVisible();

  // Step 5: Check authentication (user is not authenticated, still on login page)
  await expect(page).toHaveURL('https://freelance-learn-automation.vercel.app/login');
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  await expect(page.getByPlaceholder('Enter Email')).toBeVisible();
  await expect(page.getByPlaceholder('Enter Password')).toBeVisible();
});