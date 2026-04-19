import { test, expect } from '@playwright/test'
import { createFolder, createDocument, deleteFolder, uniqueName } from '../helpers/api'

test.describe('Chat panel', () => {
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

  test('chat input is visible when document is selected', async ({ page }) => {
    await expect(page.locator('textarea[placeholder]').last()).toBeVisible()
  })

  test('can type a message in the chat input', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder]').last()
    await chatInput.fill('Tell me about this document')
    await expect(chatInput).toHaveValue('Tell me about this document')
  })

  test('sends a message and shows it in chat', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder]').last()
    await chatInput.fill('Hello AI')
    await page.keyboard.press('Enter')

    await expect(page.getByText('Hello AI')).toBeVisible()
  })

  test('chat input clears after sending', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder]').last()
    await chatInput.fill('Test message')
    await page.keyboard.press('Enter')

    await expect(chatInput).toHaveValue('')
  })
})
