import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '@/lib/store'

// Define a type for the slice state
interface TodosState {
	clearedSearchQuery: boolean
	showTaskItems: Map<string, boolean>
	// The reason this is here is because
	// the SearchResults component uses TodoInprogressItem and TodoCompletedItem components
	// and this way, showEdits map does not have to be passed down from the very top Todos component
	showEdits: Map<string, boolean>
	inSearchResults: Set<string>
}

// Define the initial state using that type
const initialState: TodosState = {
	clearedSearchQuery: false,
	showTaskItems: new Map(),
	showEdits: new Map(),
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
		updateShowEdits: (
			state,
			action: PayloadAction<{ taskName: string; editOpened: boolean }>
		) => {
			let updatedShowEdits = new Map(
				state.showEdits.set(action.payload.taskName, action.payload.editOpened)
			)
			updatedShowEdits.forEach((_, key: string) => {
				if (key !== action.payload.taskName) {
					updatedShowEdits.set(key, false)
				}
			})
			state.showEdits = updatedShowEdits
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
	updateShowEdits,
	addInSearchResults,
	clearInSearchResults,
	setClearedSearchQuery
} = todosSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const showTaskItems = (state: RootState) => state.todos.showTaskItems
export const showEdits = (state: RootState) => state.todos.showEdits
export const inSearchResults = (state: RootState) => state.todos.inSearchResults
export const clearedSearchQuery = (state: RootState) =>
	state.todos.clearedSearchQuery

export default todosSlice.reducer
