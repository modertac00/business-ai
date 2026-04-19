import { transformFolder, transformFolders } from '../handle-transformation'

export const foldersMutations = {
  createFolder: {
    getUrl: () => '/api/folders',
    method: 'POST',
    transformResponse: transformFolder,
    invalidatesTags: ['FOLDERS'],
  },
  updateFolder: {
    getUrl: ({ id }: { id: string; name: string }) => `/api/folders/${id}`,
    getBody: ({ name }: { id: string; name: string }) => ({ name }),
    method: 'PATCH',
    transformResponse: transformFolder,
    invalidatesTags: ['FOLDERS'],
  },
  deleteFolder: {
    getUrl: ({ id }: { id: string }) => `/api/folders/${id}`,
    getBody: () => undefined,
    method: 'DELETE',
    transformResponse: () => null,
    invalidatesTags: ['FOLDERS'],
  },
}

export const foldersQueries = {
  getFolders: {
    getUrl: () => '/api/folders',
    method: 'GET',
    transformResponse: transformFolders,
    providesTags: ['FOLDERS'],
  },
}
