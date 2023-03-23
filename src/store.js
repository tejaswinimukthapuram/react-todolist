import { configureStore } from '@reduxjs/toolkit'
import todolistReducer from './reducers/todolist'

export const Store = configureStore({
  reducer: {
    todosCount:todolistReducer
  },
})