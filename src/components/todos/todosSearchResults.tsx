'use client'

import React from 'react'

import CloseIcon from '@mui/icons-material/Close'

import { useAppDispatch } from '@/lib/hooks'

import {
	clearInSearchResults,
	setClearedSearchQuery
} from '@/lib/features/todos/todosSlice'

import TodosInProgressItem from './todosInProgressItem'
import TodosCompletedItem from './todosCompletedItem'

export default function TodosSearchResults({
	userId,
	searchQuery,
	searchResults
}: {
	userId: string
	searchQuery: string
	searchResults: TodoDatum[]
}) {
	const dispatch = useAppDispatch()

	const handleClose = () => {
		dispatch(clearInSearchResults())
		dispatch(setClearedSearchQuery(true))
	}

	return (
		<>
			<div className='w-full flex pt-5'>
				<h3 className='w-1/2 flex justify-start text-xl font-semibold'>
					Search Results for '{searchQuery}'
				</h3>
				<button className='w-1/2 flex justify-end' onClick={handleClose}>
					<CloseIcon fontSize='large' />
				</button>
			</div>
			<div className='flex flex-col gap-5 pl-5 pt-5 pb-5'>
				<h4 className='text-lg font-semibold'>In Progress</h4>
				<div className='flex flex-col gap-5'>
					{searchResults.map((result: TodoDatum) => {
						return (
							<React.Fragment key={result.item}>
								<TodosInProgressItem userId={userId} datum={result} />
							</React.Fragment>
						)
					})}
				</div>
				<h4 className='text-lg font-semibold'>Completed</h4>
				<div className='flex flex-col gap-5'>
					{searchResults.map((result: TodoDatum) => {
						return (
							<React.Fragment key={result.item}>
								<TodosCompletedItem userId={userId} datum={result} />
							</React.Fragment>
						)
					})}
				</div>
			</div>
		</>
	)
}
