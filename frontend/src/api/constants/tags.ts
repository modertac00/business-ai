export const TAGS = ['FOLDERS', 'DOCUMENT', 'MESSAGES'] as const
export type Tag = (typeof TAGS)[number]
