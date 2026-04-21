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

  test('creates document with Enter key', async ({ page }) => {
    const docName = uniqueName('Doc')
    await page.goto('/')

    await page.hover(`text=${folderName}`)
    await page.click('[title="New document"]')
    await page.fill('input[placeholder="e.g. Carbon Report 2025"]', docName)
    await page.keyboard.press('Enter')

    await expect(page.getByText(docName)).toBeVisible()
  })

  test('cancel document modal does not create document', async ({ page }) => {
    await page.goto('/')

    await page.hover(`text=${folderName}`)
    await page.click('[title="New document"]')
    await page.fill('input[placeholder="e.g. Carbon Report 2025"]', 'Ghost Doc')
    await page.click('button:has-text("Cancel")')

    await expect(page.getByText('Ghost Doc')).not.toBeVisible()
  })

  test('selecting a document loads it in the editor', async ({ page }) => {
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

  test('document shows in sidebar under its workspace', async ({ page }) => {
    const docName = uniqueName('Doc')
    await page.goto('/')

    await page.hover(`text=${folderName}`)
    await page.click('[title="New document"]')
    await page.fill('input[placeholder="e.g. Carbon Report 2025"]', docName)
    await page.click('button:has-text("Create")')

    await expect(page.getByText(folderName)).toBeVisible()
    await expect(page.getByText(docName)).toBeVisible()
  })

  test('chat panel shows document context when document is selected', async ({ page }) => {
    const docName = uniqueName('Doc')
    await page.goto('/')

    await page.hover(`text=${folderName}`)
    await page.click('[title="New document"]')
    await page.fill('input[placeholder="e.g. Carbon Report 2025"]', docName)
    await page.click('button:has-text("Create")')
    await page.click(`text=${docName}`)

    await expect(page.getByText(docName)).toHaveCount(2)
  })
})
