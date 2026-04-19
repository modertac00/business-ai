import { APIRequestContext } from '@playwright/test'

const BASE = process.env.PLAYWRIGHT_API_URL ?? 'http://localhost:3002/api'

export interface TestFolder {
  id: string
  name: string
}

export interface TestDocument {
  id: string
  name: string
  folderId: string
}

export async function createFolder(request: APIRequestContext, name: string): Promise<TestFolder> {
  const res = await request.post(`${BASE}/folders`, { data: { name } })
  return res.json()
}

export async function createDocument(
  request: APIRequestContext,
  folderId: string,
  name: string,
): Promise<TestDocument> {
  const res = await request.post(`${BASE}/folders/${folderId}/documents`, {
    data: { name, type: 'doc', status: 'empty' },
  })
  return res.json()
}

export async function deleteFolder(request: APIRequestContext, id: string): Promise<void> {
  await request.delete(`${BASE}/folders/${id}`)
}

export async function deleteDocument(
  request: APIRequestContext,
  folderId: string,
  id: string,
): Promise<void> {
  await request.delete(`${BASE}/folders/${folderId}/documents/${id}`)
}

export function uniqueName(prefix: string): string {
  return `${prefix}-${Date.now()}`
}
