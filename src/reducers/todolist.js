import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
  
}

export const todoSlice = createSlice({
  name: 'todosCount',
  initialState,
  reducers: {
    add: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload.length
    },
    // remove: (state, action) => {
    //   state.value = []
    // },
   
  },
})

// Action creators are generated for each case reducer function
export const { add } = todoSlice.actions

export default todoSlice.reducer
