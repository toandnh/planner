import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '@/lib/store'

// Define a type for the slice state
interface TodosState {
	clearedSearchQuery: boolean
	showTaskItems: Map<string, boolean>
	inSearchResults: Set<string>
}

// Define the initial state using that type
const initialState: TodosState = {
	clearedSearchQuery: false,
	showTaskItems: new Map(),
	inSearchResults: new Set()
}

export const todosSlice = createSlice({
	name: 'todos',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		updateShowTaskItems: (
			state,
			action: PayloadAction<{ taskName: string; taskOpened: boolean }>
		) => {
			state.showTaskItems = new Map(
				state.showTaskItems.set(
					action.payload.taskName,
					action.payload.taskOpened
				)
			)
		},
		addInSearchResults: (state, action: PayloadAction<string[]>) => {
			let searchResults = new Set<string>()
			action.payload.map((str: string) => searchResults.add(str))
			state.inSearchResults = searchResults
		},
		clearInSearchResults: (state) => {
			state.inSearchResults = new Set<string>()
		},
		setClearedSearchQuery: (state, action: PayloadAction<boolean>) => {
			state.clearedSearchQuery = action.payload
		}
	}
})

export const {
	updateShowTaskItems,
	addInSearchResults,
	clearInSearchResults,
	setClearedSearchQuery
} = todosSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const showTaskItems = (state: RootState) => state.todos.showTaskItems
export const inSearchResults = (state: RootState) => state.todos.inSearchResults
export const clearedSearchQuery = (state: RootState) =>
	state.todos.clearedSearchQuery

export default todosSlice.reducer
