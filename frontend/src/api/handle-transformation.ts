import type { Folder, DocFile, DocSection, ChatMessage } from '../types'

export interface ApiFolder {
  id: string
  name: string
  documents: DocFile[]
}

export interface ApiDocument {
  id: string
  name: string
  type: 'doc' | 'template'
  status: 'done' | 'draft' | 'empty'
  folderId: string
  sections: DocSection[]
}

export interface ApiChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  chips: string[] | null
  sectionIndicator: string | null
}

export const commonTransform = (res: any) => res

export const transformFolder = (f: ApiFolder): Folder => ({
  id: f.id,
  name: f.name,
  files: f.documents ?? [],
})

export const transformFolders = (folders: ApiFolder[]): Folder[] =>
  folders.map(transformFolder)

export const transformMessage = (m: ApiChatMessage): ChatMessage => ({
  id: m.id,
  role: m.role,
  text: m.text,
  chips: m.chips ?? undefined,
  sectionIndicator: m.sectionIndicator ?? undefined,
})

export const transformMessages = (msgs: ApiChatMessage[]): ChatMessage[] =>
  msgs.map(transformMessage)
