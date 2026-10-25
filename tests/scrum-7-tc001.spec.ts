import { test, expect } from '@playwright/test';

test('SCRUM-7-TC001 Verify user can log in with valid credentials and log out successfully.', async ({ page }) => {
  // Step 1: Navigate to login page
  await page.goto('https://freelance-learn-automation.vercel.app/login');
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Enter Email' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Enter Password' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

  // Step 2: Enter email
  await page.getByRole('textbox', { name: 'Enter Email' }).fill('admin@email.com');
  await expect(page.getByRole('textbox', { name: 'Enter Email' })).toHaveValue('admin@email.com');

  // Step 3: Enter password
  await page.getByRole('textbox', { name: 'Enter Password' }).fill('admin@123');
  await expect(page.getByRole('textbox', { name: 'Enter Password' })).toHaveValue('admin@123');

  // Step 4: Click Sign in
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome Admin Manager to Learn Automation Courses' })).toBeVisible();

  // Step 5: Open navigation menu
  await page.getByRole('img', { name: 'menu' }).click();
  await expect(
    page.getByRole('link', { name: 'Sign out' }).or(page.getByRole('button', { name: 'Sign out' }))
  ).toBeVisible();

  // Step 6: Click Sign out
  const signOut = page.getByRole('link', { name: 'Sign out' }).or(page.getByRole('button', { name: 'Sign out' }));
  await signOut.click();
  await expect(page).toHaveURL(/login/);
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
});
