import { test, expect } from '@playwright/test';

test('TC_LOGIN_001 - Verify login with valid email and password', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 2: Enter valid email address
  await page.getByPlaceholder('Enter Email').fill('admin@email.com');
  await expect(page.getByPlaceholder('Enter Email')).toHaveValue('admin@email.com');

  // Step 3: Enter valid password
  await page.getByPlaceholder('Enter Password').fill('admin@123');
  await expect(page.getByPlaceholder('Enter Password')).toHaveValue('admin@123');

  // Step 4: Click the Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome Admin Manager to Learn Automation Courses' })).toBeVisible();

  // Step 5: Verify URL should not be in url
  await expect(page).not.toHaveURL(/login/);
});