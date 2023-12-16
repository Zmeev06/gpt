import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        value: '',
    },
    reducers: {
        setNewChat: (state, action) => {
            state.value = action.payload
            console.log('tet'+state.value)
        },
    },
})

export const { setNewChat } = chatSlice.actions

export const selectChat = (state) => state.chat.value

export default chatSlice.reducer