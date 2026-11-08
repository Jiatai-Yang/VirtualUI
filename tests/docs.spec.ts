import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('desktop collection, filters, code, details and working component interactions', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Good interfaces start here/ })).toBeVisible();
  await expect(page.locator('.component-card')).toHaveCount(8);
  await page.screenshot({ path: 'artifacts/desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Forms', exact: true }).click();
  await expect(page.locator('.component-card')).toHaveCount(3);
  await page.getByRole('textbox', { name: 'Search components' }).fill('button');
  await expect(page.locator('.component-card')).toHaveCount(1);
  await page.locator('.component-card').getByRole('button', { name: 'Code', exact: true }).click();
  await expect(page.locator('.component-card pre')).toContainText("from '@virtuui/react'");
  await page.getByRole('textbox', { name: 'Search components' }).fill('doesnotexist');
  await expect(page.getByRole('heading', { name: 'No components found' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await page.getByRole('button', { name: 'Create project', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('saved');
  await page.getByRole('switch', { name: 'Marketing updates' }).click();
  await expect(page.getByRole('switch', { name: 'Marketing updates' })).toBeChecked();
  await page.getByRole('button', { name: 'Actions', exact: true }).last().click();
  await expect(page.getByRole('menuitem', { name: 'Edit file' })).toBeFocused();
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('duplicate');
  await page.getByRole('button', { name: 'View Tabs documentation' }).click();
  await expect(page).toHaveURL(/#Tabs$/);
  await expect(page.getByRole('heading', { name: 'API reference' })).toBeVisible();
  await page.getByRole('tab', { name: 'Overview' }).click(); await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');
  await page.goBack(); await expect(page.locator('.component-card')).toHaveCount(8);
  expect(errors).toEqual([]);
});

test('light and dark collection pass automated accessibility checks; theme persists', async ({ page }) => {
  await page.goto('/');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => ({ target: node.target, summary: node.failureSummary })) }))).toEqual([]);
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-vui-theme', 'dark');
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-vui-theme', 'dark');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => ({ target: node.target, summary: node.failureSummary })) }))).toEqual([]);
  await page.screenshot({ path: 'artifacts/dark.png', fullPage: true });
});

test('mobile layout, navigation, token catalog and setup have no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Good interfaces start here/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: 'Design tokens', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A shared visual language.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: 'Getting started', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A good place to start.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
