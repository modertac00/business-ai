import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ChatMessage } from '../types'
import { INITIAL_MESSAGES } from '../data/mockData'

interface ChatState {
  messages: ChatMessage[]
  input: string
}

const initialState: ChatState = {
  messages: INITIAL_MESSAGES,
  input: '',
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setInput(state, action: PayloadAction<string>) {
      state.input = action.payload
    },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload)
    },
  },
})

export const { setInput, addMessage } = chatSlice.actions

export default chatSlice.reducer
