import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { setActiveDocument } from '../store/uiSlice'
import { setInput, addLocalMessage, clearLocalMessages } from '../store/chatSlice'
import {
  useGetFoldersQuery,
  useGetDocumentQuery,
  useGetMessagesQuery,
  useCreateFolderMutation,
  useCreateDocumentMutation,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useSendMessageMutation,
} from '../api'
import type { Folder, ChatMessage } from '../types'
import type { ApiDocument } from '../api/handle-transformation'

export function useDocStore() {
  const dispatch = useAppDispatch()

  const activeDocumentId = useAppSelector((s) => s.ui.activeDocumentId)
  const activeFolderId = useAppSelector((s) => s.ui.activeFolderId)
  const input = useAppSelector((s) => s.chat.input)
  const localMessages = useAppSelector((s) => s.chat.localMessages)

  const { data: foldersData, isLoading } = useGetFoldersQuery(undefined)
  const folders = (foldersData ?? []) as Folder[]

  const { data: documentData } = useGetDocumentQuery(
    { folderId: activeFolderId!, id: activeDocumentId! },
    { skip: !activeFolderId || !activeDocumentId },
  )
  const document = documentData as ApiDocument | undefined

  const { data: dbMessagesData } = useGetMessagesQuery(activeDocumentId!, {
    skip: !activeDocumentId,
  })
  const dbMessages = (dbMessagesData ?? []) as ChatMessage[]

  const [createFolderMutation] = useCreateFolderMutation()
  const [createDocumentMutation] = useCreateDocumentMutation()
  const [createSectionMutation] = useCreateSectionMutation()
  const [updateSectionMutation] = useUpdateSectionMutation()
  const [sendMessageMutation, { isLoading: sending }] = useSendMessageMutation()

  const selectDocument = useCallback(
    (documentId: string) => {
      const folder = folders.find((f) => f.files.some((file) => file.id === documentId))
      if (!folder) return
      dispatch(setActiveDocument({ documentId, folderId: folder.id }))
      dispatch(clearLocalMessages())
    },
    [dispatch, folders],
  )

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !activeDocumentId) return
      dispatch(setInput(''))
      sendMessageMutation({ documentId: activeDocumentId, text }).then(() => {
        setTimeout(() => {
          dispatch(
            addLocalMessage({
              id: Date.now().toString(),
              role: 'ai',
              text: 'Got it — working on that now.',
              chips: ['Continue', 'Revise', 'Skip'],
            }),
          )
        }, 800)
      })
    },
    [dispatch, activeDocumentId, sendMessageMutation],
  )

  const handleAddSection = useCallback(() => {
    if (!activeDocumentId) return
    createSectionMutation({
      documentId: activeDocumentId,
      title: 'New Section',
      order: document?.sections.length ?? 0,
    })
  }, [activeDocumentId, createSectionMutation, document?.sections.length])

  const handleUpdateSection = useCallback(
    (id: string, content: string) => {
      if (!activeDocumentId) return
      updateSectionMutation({ documentId: activeDocumentId, id, content, status: 'done' })
    },
    [activeDocumentId, updateSectionMutation],
  )

  return {
    folders,
    activeFileId: activeDocumentId ?? '',
    activeFolderId,
    loading: isLoading,
    sending,
    docTitle: document?.name ?? '',
    sections: document?.sections ?? [],
    messages: [...dbMessages, ...localMessages],
    input,
    setActiveFileId: selectDocument,
    setDocTitle: () => {},
    addSection: handleAddSection,
    updateSection: handleUpdateSection,
    sendMessage: handleSendMessage,
    setInput: (value: string) => dispatch(setInput(value)),
    addFolder: (name: string) => createFolderMutation({ name }),
    addDocument: (folderId: string, name: string) =>
      createDocumentMutation({ folderId, name }),
  }
}
