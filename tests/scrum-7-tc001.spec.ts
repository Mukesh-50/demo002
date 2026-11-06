import { test, expect } from '@playwright/test';

test('SCRUM-7-TC001 Verify user can log in with valid credentials and log out successfully.', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page to be displayed with heading "Sign In"
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  // Expect the email and password fields to be visible
  await expect(page.getByPlaceholder('Enter Email')).toBeVisible();
  await expect(page.getByPlaceholder('Enter Password')).toBeVisible();

  // Step 2: Enter email
  await page.getByPlaceholder('Enter Email').fill('admin@email.com');
  // Expect the email field contains the entered value
  await expect(page.getByPlaceholder('Enter Email')).toHaveValue('admin@email.com');

  // Step 3: Enter password
  await page.getByPlaceholder('Enter Password').fill('admin@123');
  // Expect the password field contains the entered value (masked)
  await expect(page.getByPlaceholder('Enter Password')).toHaveValue('admin@123');

  // Step 4: Click Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Expect user is redirected to home page (URL does not contain 'login')
  await expect(page).not.toHaveURL(/login/);
  // Expect course cards such as "Selenium For Web Automation" are visible
  await expect(page.getByRole('heading', { name: 'Selenium For Web Automation' })).toBeVisible();
  // Expect navigation bar includes a "Sign out" button
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  // Step 5: Open navigation menu
  await page.getByRole('img', { name: 'menu' }).click();
  // Expect navigation menu is displayed with options like "Home", "Practise", and "Sign out"
  await expect(page.getByText('Home')).toBeVisible();
  await expect(page.getByText('Practise')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

  // Step 6: Click Sign out
  await page.getByRole('button', { name: 'Sign out' }).click();
  // Expect user is redirected to login page and "Sign In" form is visible again
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  // Step 7: Check URL
  await expect(page).toHaveURL(/login/);
});