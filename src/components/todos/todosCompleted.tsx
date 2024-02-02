'use client'

import React, { useMemo } from 'react'

import { useAppSelector } from '@/lib/hooks'

import { inSearchResults } from '@/lib/features/todos/todosSlice'

import TodosCompletedItem from './todosCompletedItem'

import { sortByTaskNameAsc } from '../utilities/utilities'

export default function TodosCompleted({
	isLoading,
	data
}: {
	isLoading: boolean
	data: TodoDatum[]
}) {
	const inResults = useAppSelector(inSearchResults)

	const sortedData = useMemo(() => sortByTaskNameAsc(data), [data])

	return (
		<div className='h-full w-full flex flex-col gap-5'>
			<h3 className='text-xl font-semibold'>Completed</h3>
			<div className='flex flex-col gap-3 pl-5 pt-5 pb-5'>
				{!isLoading &&
					sortedData.map((datum: TodoDatum) => {
						return (
							<React.Fragment key={datum.item}>
								{!inResults.has(datum.task!) && (
									<TodosCompletedItem datum={datum} />
								)}
							</React.Fragment>
						)
					})}
			</div>
		</div>
	)
}
