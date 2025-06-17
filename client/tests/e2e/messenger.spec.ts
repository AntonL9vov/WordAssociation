import { test, expect } from '@playwright/test';

test('messenger functionality', async ({ page }) => {
  // Переходим на страницу
  await page.goto('/');

  // Проверяем, что мессенджер отображается
  const messenger = page.locator('.game-messenger');
  await expect(messenger).toBeVisible();

  // Проверяем наличие истории сообщений
  const messageHistory = page.locator('.messenger-history');
  await expect(messageHistory).toBeVisible();

  // Проверяем наличие поля ввода
  const input = page.locator('input[type="text"]');
  await expect(input).toBeVisible();

  // Проверяем наличие кнопки отправки
  const sendButton = page.locator('button:has-text("Send")');
  await expect(sendButton).toBeVisible();
}); 