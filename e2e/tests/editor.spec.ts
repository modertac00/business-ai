import { test, expect } from '@playwright/test'
import { createFolder, createDocument, deleteFolder, uniqueName } from '../helpers/api'

test.describe('Editor — sections', () => {
  let folderId: string
  let documentId: string
  let docName: string

  test.beforeEach(async ({ page, request }) => {
    const folder = await createFolder(request, uniqueName('Folder'))
    folderId = folder.id
    docName = uniqueName('Doc')
    const doc = await createDocument(request, folderId, docName)
    documentId = doc.id

    await page.goto('/')
    await expect(page.getByText(folder.name)).toBeVisible()
    await page.click(`text=${docName}`)
    await expect(page.locator('button:has-text("+ add section")')).toBeVisible()
  })

  test.afterEach(async ({ request }) => {
    await deleteFolder(request, folderId)
  })

  test('adds a new section', async ({ page }) => {
    await page.click('button:has-text("+ add section")')

    await expect(page.getByText('New Section')).toBeVisible()
    await expect(page.getByText('empty')).toBeVisible()
  })

  test('adds multiple sections with incrementing numbers', async ({ page }) => {
    await page.click('button:has-text("+ add section")')
    await page.click('button:has-text("+ add section")')

    await expect(page.getByText('01 —')).toBeVisible()
    await expect(page.getByText('02 —')).toBeVisible()
  })

  test('can write content in a section manually', async ({ page }) => {
    await page.click('button:has-text("+ add section")')

    await page.click('button:has-text("+ write manually or generate with AI")')
    await page.fill('textarea', 'This is test content for the section.')
    await page.click('button:has-text("Save")')

    await expect(page.getByText('This is test content for the section.')).toBeVisible()
    await expect(page.getByText('done')).toBeVisible()
  })

  test('can cancel editing a section', async ({ page }) => {
    await page.click('button:has-text("+ add section")')

    await page.click('button:has-text("+ write manually or generate with AI")')
    await page.fill('textarea', 'Unsaved content')
    await page.click('button:has-text("Cancel")')

    await expect(page.getByText('Unsaved content')).not.toBeVisible()
  })

  test('section shows edit button after content is saved', async ({ page }) => {
    await page.click('button:has-text("+ add section")')
    await page.click('button:has-text("+ write manually or generate with AI")')
    await page.fill('textarea', 'Some content')
    await page.click('button:has-text("Save")')

    await expect(page.locator('button:has-text("✎ edit this section")')).toBeVisible()
  })
})
