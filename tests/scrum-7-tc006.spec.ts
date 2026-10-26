import { test, expect } from '@playwright/test';

test('SCRUM-7-TC006 Verify navigation menu displays Sign out and not Log in for authenticated user', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page to be displayed by checking for the email and password fields
  await expect(page.getByPlaceholder('Enter Email')).toBeVisible();
  await expect(page.getByPlaceholder('Enter Password')).toBeVisible();

  // Step 2: Enter email
  await page.getByPlaceholder('Enter Email').fill('admin@email.com');
  // Expect the email field contains the entered value
  await expect(page.getByPlaceholder('Enter Email')).toHaveValue('admin@email.com');

  // Step 3: Enter password
  await page.getByPlaceholder('Enter Password').fill('admin@123');
  // Expect the password field contains the entered value (masked, but we check the value)
  await expect(page.getByPlaceholder('Enter Password')).toHaveValue('admin@123');

  // Step 4: Click Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Expect user is redirected to home page and welcome message is visible
  await expect(page.getByText('Welcome Admin Manager to Learn Automation Courses')).toBeVisible();

  // Step 5: Open navigation menu
  await page.getByRole('img', { name: 'menu' }).click();
  // Expect the navigation menu is displayed (check for "Home" link as a menu item)
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();

  // Step 6: Check for Sign out option
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  // Step 7: Check for Log in option
  await expect(page.getByRole('button', { name: 'Log in' })).not.toBeVisible();
  await expect(page.getByRole('link', { name: 'Log in' })).not.toBeVisible();
});