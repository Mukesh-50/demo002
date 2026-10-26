import { test, expect } from '@playwright/test';

test('SCRUM-7-TC001 Verify user can log in with valid credentials and log out successfully.', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page to be displayed (check for "Sign In" heading)
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  // Expect email and password fields to be visible
  await expect(page.getByPlaceholder('Enter Email')).toBeVisible();
  await expect(page.getByPlaceholder('Enter Password')).toBeVisible();
  // Expect "Sign in" button to be visible
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

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
  // Expect user is redirected to home page (check for welcome message)
  await expect(page.getByText('Welcome Admin Manager to Learn Automation Courses')).toBeVisible();

  // Step 5: Open navigation menu
  await page.getByRole('img', { name: 'menu' }).click();
  // Expect navigation menu is displayed (check for "Sign out" button)
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  // Step 6: Click Sign out
  await page.getByRole('button', { name: 'Sign out' }).click();
  // Expect user is redirected to login page (check for "Sign In" heading)
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 7: Check URL contains 'login'
  await expect(page).toHaveURL(/login/);
});