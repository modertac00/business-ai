import { transformSendMessageResponse, transformMessages } from '../handle-transformation'

export const chatMutations = {
  sendMessage: {
    getUrl: ({ documentId }: { documentId: string; text: string }) =>
      `/api/documents/${documentId}/chat/messages`,
    getBody: ({ text }: { documentId: string; text: string }) => ({ text }),
    method: 'POST',
    transformResponse: transformSendMessageResponse,
    invalidatesTags: ['MESSAGES'],
  },
  clearMessages: {
    getUrl: ({ documentId }: { documentId: string }) =>
      `/api/documents/${documentId}/chat/messages`,
    getBody: () => undefined,
    method: 'DELETE',
    transformResponse: () => null,
    invalidatesTags: ['MESSAGES'],
  },
}

export const chatQueries = {
  getMessages: {
    getUrl: (documentId: string) => `/api/documents/${documentId}/chat`,
    method: 'GET',
    transformResponse: transformMessages,
    providesTags: ['MESSAGES'],
  },
}
