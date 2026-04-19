import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  activeDocumentId: string | null
  activeFolderId: string | null
}

const initialState: UIState = {
  activeDocumentId: null,
  activeFolderId: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveDocument(
      state,
      action: PayloadAction<{ documentId: string; folderId: string }>,
    ) {
      state.activeDocumentId = action.payload.documentId
      state.activeFolderId = action.payload.folderId
    },
    clearActiveDocument(state) {
      state.activeDocumentId = null
      state.activeFolderId = null
    },
  },
})

export const { setActiveDocument, clearActiveDocument } = uiSlice.actions
export default uiSlice.reducer
