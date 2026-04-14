import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Folder, DocSection } from '../types'
import { FOLDERS, INITIAL_SECTIONS } from '../data/mockData'

interface DocState {
  folders: Folder[]
  activeFileId: string
  docTitle: string
  sections: DocSection[]
}

const initialState: DocState = {
  folders: FOLDERS,
  activeFileId: 'carbon',
  docTitle: 'Carbon Footprint Report 2025',
  sections: INITIAL_SECTIONS,
}

const docSlice = createSlice({
  name: 'doc',
  initialState,
  reducers: {
    setActiveFileId(state, action: PayloadAction<string>) {
      state.activeFileId = action.payload
    },
    setDocTitle(state, action: PayloadAction<string>) {
      state.docTitle = action.payload
    },
    addSection(state) {
      const num = (state.sections.length + 1).toString().padStart(2, '0')
      state.sections.push({
        id: `s${Date.now()}`,
        number: num,
        title: 'New Section',
        content: '',
        status: 'empty',
      })
    },
    updateSection(state, action: PayloadAction<{ id: string; content: string }>) {
      const section = state.sections.find((s) => s.id === action.payload.id)
      if (section) {
        section.content = action.payload.content
        section.status = 'done'
      }
    },
    addFolder(state) {
      state.folders.push({
        id: `folder-${Date.now()}`,
        name: 'New Folder',
        files: [],
      })
    },
    addFile(state, action: PayloadAction<string>) {
      const folder = state.folders.find((f) => f.id === action.payload)
      if (folder) {
        folder.files.push({
          id: `file-${Date.now()}`,
          name: 'Untitled Document',
          type: 'doc',
          status: 'empty',
        })
      }
    },
  },
})

export const { setActiveFileId, setDocTitle, addSection, updateSection, addFolder, addFile } =
  docSlice.actions

export default docSlice.reducer
