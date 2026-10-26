import { test, expect } from '@playwright/test';

test('SCRUM-7-TC002 Verify error message for invalid password', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Enter email
  await page.getByPlaceholder('Enter Email').fill('admin@email.com');
  await expect(page.getByPlaceholder('Enter Email')).toHaveValue('admin@email.com');

  // Step 3: Enter password
  await page.getByPlaceholder('Enter Password').fill('admin@123456');
  await expect(page.getByPlaceholder('Enter Password')).toHaveValue('admin@123456');

  // Step 4: Click Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText("Email and Password Doesn't match")).toBeVisible();

  // Step 5: Check authentication (user is not authenticated and remains on login page)
  await expect(page).toHaveURL('https://freelance-learn-automation.vercel.app/login');
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  await expect(page.getByPlaceholder('Enter Email')).toBeVisible();
  await expect(page.getByPlaceholder('Enter Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});