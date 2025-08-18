import { test, expect } from '@playwright/test';
test('home loads', async ({ page }) => { await page.goto('http://localhost:4173/'); await expect(page.getByText(/You are not allowed to remember/i)).toBeVisible(); });
test('goat game starts', async ({ page }) => { await page.goto('http://localhost:4173/goat'); await expect(page.getByText(/Contrastive Goat/i)).toBeVisible(); });
