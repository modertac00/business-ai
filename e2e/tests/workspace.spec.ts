import { test, expect } from '@playwright/test'
import { deleteFolder, uniqueName } from '../helpers/api'

test.describe('Workspace management', () => {
  test('creates a workspace via modal', async ({ page, request }) => {
    const name = uniqueName('Workspace')
    await page.goto('/')

    await page.click('[title="New workspace"]')
    await expect(page.getByText('New Workspace')).toBeVisible()

    await page.fill('input[placeholder="e.g. Moderta ESG"]', name)
    await page.click('button:has-text("Create")')

    await expect(page.getByText(name)).toBeVisible()

    const folders = await (await request.get('http://localhost:3002/api/folders')).json()
    const created = folders.find((f: any) => f.name === name)
    if (created) await deleteFolder(request, created.id)
  })

  test('creates workspace with Enter key', async ({ page, request }) => {
    const name = uniqueName('Workspace')
    await page.goto('/')

    await page.click('[title="New workspace"]')
    await page.fill('input[placeholder="e.g. Moderta ESG"]', name)
    await page.keyboard.press('Enter')

    await expect(page.getByText(name)).toBeVisible()

    const folders = await (await request.get('http://localhost:3002/api/folders')).json()
    const created = folders.find((f: any) => f.name === name)
    if (created) await deleteFolder(request, created.id)
  })

  test('cancel modal does not create workspace', async ({ page }) => {
    await page.goto('/')

    await page.click('[title="New workspace"]')
    await page.fill('input[placeholder="e.g. Moderta ESG"]', 'Should Not Exist')
    await page.click('button:has-text("Cancel")')

    await expect(page.getByText('Should Not Exist')).not.toBeVisible()
  })

  test('Escape key closes modal without creating', async ({ page }) => {
    await page.goto('/')

    await page.click('[title="New workspace"]')
    await page.fill('input[placeholder="e.g. Moderta ESG"]', 'Will Not Exist')
    await page.keyboard.press('Escape')

    await expect(page.getByText('Will Not Exist')).not.toBeVisible()
  })

  test('Create button is disabled when name is empty', async ({ page }) => {
    await page.goto('/')

    await page.click('[title="New workspace"]')
    await expect(page.locator('button:has-text("Create")')).toBeDisabled()
  })

  test('Create button is disabled when name is only spaces', async ({ page }) => {
    await page.goto('/')

    await page.click('[title="New workspace"]')
    await page.fill('input[placeholder="e.g. Moderta ESG"]', '   ')
    await expect(page.locator('button:has-text("Create")')).toBeDisabled()
  })

  test('closes modal on backdrop click', async ({ page }) => {
    await page.goto('/')

    await page.click('[title="New workspace"]')
    await expect(page.getByText('New Workspace')).toBeVisible()

    await page.locator('.overlay').click({ force: true })
    await expect(page.getByText('New Workspace')).not.toBeVisible()
  })

  test('workspace appears in sidebar after creation', async ({ page, request }) => {
    const name = uniqueName('Folder')
    await page.goto('/')

    await page.click('[title="New workspace"]')
    await page.fill('input[placeholder="e.g. Moderta ESG"]', name)
    await page.click('button:has-text("Create")')

    await expect(page.getByText(name)).toBeVisible()

    const folders = await (await request.get('http://localhost:3002/api/folders')).json()
    const created = folders.find((f: any) => f.name === name)
    if (created) await deleteFolder(request, created.id)
  })
})
