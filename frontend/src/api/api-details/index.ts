import { foldersMutations, foldersQueries } from './folders'
import { documentsMutations, documentsQueries } from './documents'
import { sectionsMutations } from './sections'
import { chatMutations, chatQueries } from './chat'

export interface CustomEndPoint {
  method: string
  getUrl: (params: any) => string
  getBody?: (params: any) => any
  transformErrorResponse?: (res: any) => any
  transformResponse: (res: any) => any
  invalidatesTags?: string[]
  providesTags?: string[]
}

export interface CustomEndPoints {
  [key: string]: CustomEndPoint
}

export const mutations: CustomEndPoints = {
  ...foldersMutations,
  ...documentsMutations,
  ...sectionsMutations,
  ...chatMutations,
}

export const queries: CustomEndPoints = {
  ...foldersQueries,
  ...documentsQueries,
  ...chatQueries,
}
