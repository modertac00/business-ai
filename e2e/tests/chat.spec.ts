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

  test('chat panel title is visible', async ({ page }) => {
    await expect(page.getByText('Document Chat')).toBeVisible()
  })

  test('chat input is visible when document is selected', async ({ page }) => {
    await expect(
      page.locator('textarea[placeholder="Ask AI to write, edit, or restructure…"]'),
    ).toBeVisible()
  })

  test('quick prompt chips are visible', async ({ page }) => {
    await expect(page.getByText('add a section')).toBeVisible()
    await expect(page.getByText('rewrite tone')).toBeVisible()
    await expect(page.getByText('make shorter')).toBeVisible()
    await expect(page.getByText('add data table')).toBeVisible()
  })

  test('can type a message in the chat input', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder="Ask AI to write, edit, or restructure…"]')
    await chatInput.fill('Tell me about this document')
    await expect(chatInput).toHaveValue('Tell me about this document')
  })

  test('sends a message with Enter and shows it in chat', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder="Ask AI to write, edit, or restructure…"]')
    await chatInput.fill('Hello AI')
    await page.keyboard.press('Enter')

    await expect(page.getByText('Hello AI')).toBeVisible()
  })

  test('sends a message with send button and shows it in chat', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder="Ask AI to write, edit, or restructure…"]')
    await chatInput.fill('Send via button')
    await page.locator('button[class*="sendBtn"], button:has-text("↑")').click()

    await expect(page.getByText('Send via button')).toBeVisible()
  })

  test('chat input clears after sending', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder="Ask AI to write, edit, or restructure…"]')
    await chatInput.fill('Test message')
    await page.keyboard.press('Enter')

    await expect(chatInput).toHaveValue('')
  })

  test('Shift+Enter adds newline instead of sending', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder="Ask AI to write, edit, or restructure…"]')
    await chatInput.fill('Line one')
    await chatInput.press('Shift+Enter')
    await chatInput.pressSequentially('Line two')

    await expect(chatInput).toHaveValue('Line one\nLine two')
  })

  test('clicking a quick prompt chip sends that message', async ({ page }) => {
    await page.getByText('rewrite tone').click()

    await expect(page.getByText('rewrite tone')).toHaveCount(2)
  })

  test('AI responds after sending a message', async ({ page }) => {
    const chatInput = page.locator('textarea[placeholder="Ask AI to write, edit, or restructure…"]')
    await chatInput.fill('Write an intro')
    await page.keyboard.press('Enter')

    await expect(page.locator('.ai, [class*="ai"]').last()).toBeVisible({ timeout: 5000 })
  })

  test('document name shows in chat context pill', async ({ page }) => {
    await expect(page.getByText(docName)).toHaveCount(2)
  })
})
