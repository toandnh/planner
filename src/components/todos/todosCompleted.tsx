'use client'

import React from 'react'

import { useAppSelector } from '@/lib/hooks'

import { inSearchResults } from '@/lib/features/todos/todosSlice'

import TodosCompletedItem from './todosCompletedItem'

export default function TodosCompleted({
	userId,
	isLoading,
	data
}: {
	userId: string
	isLoading: boolean
	data: TodoDatum[]
}) {
	const inResults = useAppSelector(inSearchResults)

	return (
		<div className='h-full w-full flex flex-col gap-5'>
			<h3 className='justify-start text-xl font-semibold'>Completed</h3>
			<div className='flex flex-col gap-3 pl-5 pt-5 pb-5'>
				{!isLoading &&
					data.map((datum: any) => {
						return (
							<React.Fragment key={datum.item}>
								{!inResults.has(datum.task!) && (
									<TodosCompletedItem userId={userId} datum={datum} />
								)}
							</React.Fragment>
						)
					})}
			</div>
		</div>
	)
}