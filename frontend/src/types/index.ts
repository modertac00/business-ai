export type SectionStatus = 'done' | 'writing' | 'empty'

export interface DocSection {
  id: string
  number: string
  title: string
  content: string
  status: SectionStatus
}

export interface DocFile {
  id: string
  name: string
  type: 'doc' | 'template'
  status: 'done' | 'draft' | 'empty'
}

export interface Folder {
  id: string
  name: string
  files: DocFile[]
}

export type MessageRole = 'ai' | 'user'

export interface ChatMessage {
  id: string
  role: MessageRole
  text: string
  chips?: string[]
  sectionIndicator?: string
}
