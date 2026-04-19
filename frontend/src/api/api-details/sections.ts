import { commonTransform } from '../handle-transformation'

export const sectionsMutations = {
  createSection: {
    getUrl: ({ documentId }: { documentId: string }) =>
      `/api/documents/${documentId}/sections`,
    getBody: ({ title, order }: any) => ({ title, content: '', order }),
    method: 'POST',
    transformResponse: commonTransform,
    invalidatesTags: ['DOCUMENT'],
  },
  updateSection: {
    getUrl: ({ documentId, id }: { documentId: string; id: string }) =>
      `/api/documents/${documentId}/sections/${id}`,
    getBody: ({ content, status }: any) => ({ content, status }),
    method: 'PATCH',
    transformResponse: commonTransform,
    invalidatesTags: ['DOCUMENT'],
  },
  deleteSection: {
    getUrl: ({ documentId, id }: { documentId: string; id: string }) =>
      `/api/documents/${documentId}/sections/${id}`,
    getBody: () => undefined,
    method: 'DELETE',
    transformResponse: () => null,
    invalidatesTags: ['DOCUMENT'],
  },
}
