import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import logger from 'redux-logger'
import uiReducer from './uiSlice'
import chatReducer from './chatSlice'
import { baseSliceAPI } from '../api/base-slice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    chat: chatReducer,
    [baseSliceAPI.reducerPath]: baseSliceAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware().concat(baseSliceAPI.middleware)
    return import.meta.env.DEV ? middleware.concat(logger) : middleware
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
