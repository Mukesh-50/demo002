import { test, expect } from '@playwright/test';

test('SCRUM-7-TC003 Verify error message for empty email', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Leave email field empty
  const emailField = page.getByRole('textbox', { name: 'Enter Email' });
  await expect(emailField).toBeVisible();
  await expect(emailField).toHaveValue('');

  // Step 3: Enter password
  const passwordField = page.getByRole('textbox', { name: 'Enter Password' });
  await passwordField.fill('admin@123456');
  await expect(passwordField).toHaveValue('admin@123456');

  // Step 4: Click Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Email is required')).toBeVisible();

  // Step 5: Check authentication (user remains on login page)
  await expect(page).toHaveURL('https://freelance-learn-automation.vercel.app/login');
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  await expect(page.getByText('Email is required')).toBeVisible();
});
