import { test, expect } from '@playwright/test';

test('TC_LOGIN_003 Verify the "New user? Signup" link opens the signup page', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  // Expect the login page heading "Sign In" to be visible
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  // Expect the "Enter Email" textbox to be visible
  await expect(page.getByPlaceholder('Enter Email')).toBeVisible();
  // Expect the "Enter Password" textbox to be visible
  await expect(page.getByPlaceholder('Enter Password')).toBeVisible();
  // Expect the "Sign in" button to be visible
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  // Expect the "New user? Signup" link to be visible
  await expect(page.getByRole('link', { name: 'New user? Signup' })).toBeVisible();

  // Step 2: Click the "New user? Signup" link
  await page.getByRole('link', { name: 'New user? Signup' }).click();
  // Expect the signup page heading "Sign Up" to be visible
  await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
  // Expect the "Name" textbox to be visible
  await expect(page.getByPlaceholder('Name')).toBeVisible();
  // Expect the "Email" textbox to be visible
  await expect(page.getByPlaceholder('Email')).toBeVisible();
  // Expect the "Password" textbox to be visible
  await expect(page.getByPlaceholder('Password')).toBeVisible();
  // Expect the "Sign up" button to be visible
  await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();

  // Step 3: Verify signup page URL
  await expect(page).toHaveURL(/signup/);
});