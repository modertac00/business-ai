import { test, expect } from '@playwright/test'

test.describe('App loads', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders sidebar with Workspace label', async ({ page }) => {
    await expect(page.getByText('Workspace')).toBeVisible()
  })

  test('shows empty state in editor on first load', async ({ page }) => {
    await expect(page.getByText('Select a document from the sidebar to get started')).toBeVisible()
  })

  test('sidebar has new workspace button', async ({ page }) => {
    await expect(page.locator('[title="New workspace"]')).toBeVisible()
  })

  test('chat panel is visible on load', async ({ page }) => {
    await expect(page.getByText('Document Chat')).toBeVisible()
  })

  test('topbar shows app name', async ({ page }) => {
    await expect(page.getByText('doc.ai')).toBeVisible()
  })
})
