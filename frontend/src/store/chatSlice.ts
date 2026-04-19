import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ChatMessage } from '../types'

interface ChatState {
  input: string
  localMessages: ChatMessage[]
}

const initialState: ChatState = {
  input: '',
  localMessages: [],
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setInput(state, action: PayloadAction<string>) {
      state.input = action.payload
    },
    addLocalMessage(state, action: PayloadAction<ChatMessage>) {
      state.localMessages.push(action.payload)
    },
    clearLocalMessages(state) {
      state.localMessages = []
    },
  },
})

export const { setInput, addLocalMessage, clearLocalMessages } = chatSlice.actions
export default chatSlice.reducer
