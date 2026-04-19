import { commonTransform } from '../handle-transformation'

export const documentsMutations = {
  createDocument: {
    getUrl: ({ folderId }: { folderId: string; name: string }) =>
      `/api/folders/${folderId}/documents`,
    getBody: ({ name }: { folderId: string; name: string }) => ({
      name,
      type: 'doc',
      status: 'empty',
    }),
    method: 'POST',
    transformResponse: commonTransform,
    invalidatesTags: ['FOLDERS'],
  },
  updateDocument: {
    getUrl: ({ folderId, id }: { folderId: string; id: string }) =>
      `/api/folders/${folderId}/documents/${id}`,
    getBody: ({ name, status }: any) => ({ name, status }),
    method: 'PATCH',
    transformResponse: commonTransform,
    invalidatesTags: ['DOCUMENT', 'FOLDERS'],
  },
  deleteDocument: {
    getUrl: ({ folderId, id }: { folderId: string; id: string }) =>
      `/api/folders/${folderId}/documents/${id}`,
    getBody: () => undefined,
    method: 'DELETE',
    transformResponse: () => null,
    invalidatesTags: ['DOCUMENT', 'FOLDERS'],
  },
}

export const documentsQueries = {
  getDocument: {
    getUrl: ({ folderId, id }: { folderId: string; id: string }) =>
      `/api/folders/${folderId}/documents/${id}`,
    method: 'GET',
    transformResponse: commonTransform,
    providesTags: ['DOCUMENT'],
  },
}
