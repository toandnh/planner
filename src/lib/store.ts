import { configureStore } from '@reduxjs/toolkit'

import { enableMapSet } from 'immer'

import todosReducer from './features/todos/todosSlice'

enableMapSet()

export const makeStore = () => {
	return configureStore({
		reducer: {
			todos: todosReducer
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: false
			})
	})
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
