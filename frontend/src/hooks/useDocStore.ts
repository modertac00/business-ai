import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setActiveFileId,
  setDocTitle,
  addSection,
  updateSection,
  addFolder,
  addFile,
} from '../store/docSlice'
import { setInput, addMessage } from '../store/chatSlice'

export function useDocStore() {
  const dispatch = useAppDispatch()

  const folders = useAppSelector((state) => state.doc.folders)
  const activeFileId = useAppSelector((state) => state.doc.activeFileId)
  const docTitle = useAppSelector((state) => state.doc.docTitle)
  const sections = useAppSelector((state) => state.doc.sections)
  const messages = useAppSelector((state) => state.chat.messages)
  const input = useAppSelector((state) => state.chat.input)

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return
      dispatch(addMessage({ id: Date.now().toString(), role: 'user', text }))
      dispatch(setInput(''))

      setTimeout(() => {
        dispatch(
          addMessage({
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: `Got it — working on that now.`,
            chips: ['Continue', 'Revise', 'Skip'],
          })
        )
      }, 800)
    },
    [dispatch]
  )

  return {
    folders,
    activeFileId,
    setActiveFileId: (id: string) => dispatch(setActiveFileId(id)),
    docTitle,
    setDocTitle: (title: string) => dispatch(setDocTitle(title)),
    sections,
    addSection: () => dispatch(addSection()),
    updateSection: (id: string, content: string) => dispatch(updateSection({ id, content })),
    messages,
    input,
    setInput: (value: string) => dispatch(setInput(value)),
    sendMessage,
    addFolder: () => dispatch(addFolder()),
    addFile: (folderId: string) => dispatch(addFile(folderId)),
  }
}
