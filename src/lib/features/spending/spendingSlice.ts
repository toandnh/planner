import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '@/lib/store'

// Define a type for the slice state
interface SpendingState {
	showEdits: Map<string, boolean>
}

// Define the initial state using that type
const initialState: SpendingState = {
	showEdits: new Map()
}

export const spendingSlice = createSlice({
	name: 'spending',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		updateShowEdits: (
			state,
			action: PayloadAction<{ taskItem: string; editOpened: boolean }>
		) => {
			let updatedShowEdits = new Map(
				state.showEdits.set(action.payload.taskItem, action.payload.editOpened)
			)
			updatedShowEdits.forEach((_, key: string) => {
				if (key !== action.payload.taskItem) {
					updatedShowEdits.set(key, false)
				}
			})
			state.showEdits = updatedShowEdits
		}
	}
})

export const { updateShowEdits } = spendingSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const showEdits = (state: RootState) => state.spending.showEdits

export default spendingSlice.reducer
