import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './slices/chatSlice'
import statusMidReducer from './slices/statusMidSlice'
import errorReducer from './slices/errorSlice'
import counterReducer from './slices/counterSlice'

export const store = configureStore({
    reducer: {
        chat: chatReducer,
        status: statusMidReducer,
        error: errorReducer,
        counter: counterReducer
    },
})
