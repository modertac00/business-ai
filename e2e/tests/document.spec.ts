import { test, expect } from '@playwright/test'
import { createFolder, deleteFolder, uniqueName } from '../helpers/api'

test.describe('Document management', () => {
  let folderId: string
  let folderName: string

  test.beforeEach(async ({ request }) => {
    folderName = uniqueName('Folder')
    const folder = await createFolder(request, folderName)
    folderId = folder.id
  })

  test.afterEach(async ({ request }) => {
    await deleteFolder(request, folderId)
  })

  test('creates a document inside a workspace', async ({ page }) => {
    const docName = uniqueName('Doc')
    await page.goto('/')

    await expect(page.getByText(folderName)).toBeVisible()
    await page.hover(`text=${folderName}`)
    await page.click('[title="New document"]')

    await expect(page.getByText('New Document')).toBeVisible()
    await page.fill('input[placeholder="e.g. Carbon Report 2025"]', docName)
    await page.click('button:has-text("Create")')

    await expect(page.getByText(docName)).toBeVisible()
  })

  test('selecting a document loads it in the editor', async ({ page, request }) => {
    const docName = uniqueName('Doc')
    await page.goto('/')

    await page.hover(`text=${folderName}`)
    await page.click('[title="New document"]')
    await page.fill('input[placeholder="e.g. Carbon Report 2025"]', docName)
    await page.click('button:has-text("Create")')

    await page.click(`text=${docName}`)

    await expect(
      page.getByText('Select a document from the sidebar to get started'),
    ).not.toBeVisible()
    await expect(page.locator('button:has-text("+ add section")')).toBeVisible()
  })

  test('document title appears in editor topbar when selected', async ({ page }) => {
    const docName = uniqueName('MyReport')
    await page.goto('/')

    await page.hover(`text=${folderName}`)
    await page.click('[title="New document"]')
    await page.fill('input[placeholder="e.g. Carbon Report 2025"]', docName)
    await page.click('button:has-text("Create")')

    await page.click(`text=${docName}`)

    await expect(page.locator('input.titleInput, input[class*="titleInput"]')).toHaveValue(docName)
  })
})
