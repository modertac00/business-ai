import { test, expect } from '@playwright/test'
import { createFolder, createDocument, deleteFolder, uniqueName } from '../helpers/api'

test.describe('Editor — sections', () => {
  let folderId: string
  let docName: string

  test.beforeEach(async ({ page, request }) => {
    const folder = await createFolder(request, uniqueName('Folder'))
    folderId = folder.id
    docName = uniqueName('Doc')
    await createDocument(request, folderId, docName)

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

  test('new section shows write/generate button', async ({ page }) => {
    await page.click('button:has-text("+ add section")')

    await expect(
      page.locator('button:has-text("+ write manually or generate with AI")'),
    ).toBeVisible()
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

  test('can cancel editing a section without saving', async ({ page }) => {
    await page.click('button:has-text("+ add section")')
    await page.click('button:has-text("+ write manually or generate with AI")')
    await page.fill('textarea', 'Unsaved content')
    await page.click('button:has-text("Cancel")')

    await expect(page.getByText('Unsaved content')).not.toBeVisible()
    await expect(page.getByText('empty')).toBeVisible()
  })

  test('section shows edit button after content is saved', async ({ page }) => {
    await page.click('button:has-text("+ add section")')
    await page.click('button:has-text("+ write manually or generate with AI")')
    await page.fill('textarea', 'Some content')
    await page.click('button:has-text("Save")')

    await expect(page.locator('button:has-text("✎ edit this section")')).toBeVisible()
  })

  test('can edit an already saved section', async ({ page }) => {
    await page.click('button:has-text("+ add section")')
    await page.click('button:has-text("+ write manually or generate with AI")')
    await page.fill('textarea', 'Original content')
    await page.click('button:has-text("Save")')

    await page.click('button:has-text("✎ edit this section")')
    await page.fill('textarea', 'Updated content')
    await page.click('button:has-text("Save")')

    await expect(page.getByText('Updated content')).toBeVisible()
    await expect(page.getByText('Original content')).not.toBeVisible()
  })

  test('section status changes from empty to done after saving', async ({ page }) => {
    await page.click('button:has-text("+ add section")')
    await expect(page.getByText('empty')).toBeVisible()

    await page.click('button:has-text("+ write manually or generate with AI")')
    await page.fill('textarea', 'Content here')
    await page.click('button:has-text("Save")')

    await expect(page.getByText('done')).toBeVisible()
    await expect(page.getByText('empty')).not.toBeVisible()
  })

  test('can add multiple sections and write content in each', async ({ page }) => {
    await page.click('button:has-text("+ add section")')
    await page.click('button:has-text("+ add section")')

    const writeButtons = page.locator('button:has-text("+ write manually or generate with AI")')
    await writeButtons.first().click()
    await page.fill('textarea', 'Section one content')
    await page.click('button:has-text("Save")')

    await writeButtons.last().click()
    await page.fill('textarea', 'Section two content')
    await page.click('button:has-text("Save")')

    await expect(page.getByText('Section one content')).toBeVisible()
    await expect(page.getByText('Section two content')).toBeVisible()
  })
})
