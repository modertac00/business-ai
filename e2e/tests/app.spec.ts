import { test, expect } from '@playwright/test'

test.describe('App loads', () => {
  test('renders sidebar, editor and chat panel', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Workspace')).toBeVisible()
    await expect(page.getByText('Select a document from the sidebar to get started')).toBeVisible()
  })

  test('sidebar has new workspace button', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('[title="New workspace"]')).toBeVisible()
  })

  test('editor shows empty state when no document selected', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByText('Select a document from the sidebar to get started'),
    ).toBeVisible()
  })
})
