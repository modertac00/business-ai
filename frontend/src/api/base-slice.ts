import { createApi } from '@reduxjs/toolkit/query/react'
import { mutations, queries } from './api-details'
import { transformErrorResponse } from './handle-errors'
import baseQuery from './client'
import { TAGS } from './constants/tags'

const endPoints: Record<string, any> = {}

export const baseSliceAPI = createApi({
  reducerPath: 'baseSlice',
  baseQuery,
  tagTypes: [...TAGS],
  endpoints: (build) => {
    Object.keys(mutations).forEach((key) => {
      const api = mutations[key]
      endPoints[key] = build.mutation({
        query: (params: any) => ({
          url: api.getUrl(params),
          method: api.method,
          body: api.getBody ? api.getBody(params) : params,
        }),
        transformResponse: (response) => api.transformResponse(response),
        transformErrorResponse: (response) =>
          api.transformErrorResponse
            ? api.transformErrorResponse(response)
            : transformErrorResponse(response),
        invalidatesTags: (api.invalidatesTags ?? []) as any,
      })
    })

    Object.keys(queries).forEach((key) => {
      const api = queries[key]
      endPoints[key] = build.query({
        query: (params: any) => ({
          url: api.getUrl(params),
          method: api.method,
        }),
        transformResponse: (response) => api.transformResponse(response),
        transformErrorResponse: (response) => transformErrorResponse(response),
        providesTags: (api.providesTags ?? []) as any,
      })
    })

    return endPoints
  },
})

export const {
  // Folders
  useGetFoldersQuery,
  useCreateFolderMutation,
  useUpdateFolderMutation,
  useDeleteFolderMutation,

  // Documents
  useGetDocumentQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,

  // Sections
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,

  // Chat
  useGetMessagesQuery,
  useSendMessageMutation,
  useClearMessagesMutation,
} = baseSliceAPI
