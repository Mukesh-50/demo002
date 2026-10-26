import { test, expect } from '@playwright/test';

test('SCRUM-7-TC001 Verify user can log in with valid credentials and log out successfully.', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Enter email
  await page.getByPlaceholder('Enter Email').fill('admin@email.com');
  await expect(page.getByPlaceholder('Enter Email')).toHaveValue('admin@email.com');

  // Step 3: Enter password
  await page.getByPlaceholder('Enter Password').fill('admin@123');
  await expect(page.getByPlaceholder('Enter Password')).toHaveValue('admin@123');

  // Step 4: Click Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Welcome Admin Manager to Learn Automation Courses')).toBeVisible();

  // Step 5: Open navigation menu
  await page.getByRole('img', { name: 'menu' }).click();
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  // Step 6: Click Sign out option
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 7: Check URL
  await expect(page).toHaveURL(/login/);
});