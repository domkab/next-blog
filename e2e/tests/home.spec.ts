import { test, expect } from '@playwright/test';

test('home page loads and first post can be opened', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('View all posts')).toBeVisible();

  const homeImages = page.locator('img');
  await expect(homeImages.first()).toBeVisible();

  const firstPostLink = page.locator('a[href^="/post/"]').first();
  await firstPostLink.click();

  await expect(page.locator('h1.post__title')).toBeVisible();
  const postImages = page.locator('img');
  await expect(postImages.first()).toBeVisible();
});