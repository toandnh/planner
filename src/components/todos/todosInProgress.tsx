'use client'

import React, { useMemo } from 'react'

import { useAppSelector } from '@/lib/hooks'

import { inSearchResults } from '@/lib/features/todos/todosSlice'

import TodosInProgressItem from './todosInProgressItem'
import TodosAddForm from './todosAddForm'

export default function TodosInProgress({
	userId,
	isLoading,
	data
}: {
	userId: string
	isLoading: boolean
	data: TodoDatum[]
}) {
	const inResults = useAppSelector(inSearchResults)

	const totalNumTasks: number = useMemo(() => {
		return !isLoading ? data.length : 0
	}, [data])

	return (
		<div className='h-full w-full flex flex-col gap-5'>
			<h3 className='justify-start text-xl font-semibold'>In Progress</h3>
			{!isLoading && (
				<div className='flex flex-col justify-center gap-10 pl-5 pt-5 pb-5'>
					<div className='flex'>
						<div className='w-1/3 flex justify-start font-semibold'>
							<p className='hidden'>HIDDEN</p>
						</div>
						<div className='w-full flex justify-start font-semibold'>Task</div>
						<div className='w-full flex justify-start font-semibold'>
							Progress
						</div>
						<div className='w-1/3'>
							<p className='hidden'>HIDDEN</p>
						</div>
						<div className='w-1/3'>
							<p className='hidden'>HIDDEN</p>
						</div>
						<div className='w-1/3'>
							<p className='hidden'>HIDDEN</p>
						</div>
					</div>
					<div className='flex flex-col gap-5'>
						{data.map((datum: TodoDatum) => {
							return (
								<React.Fragment key={datum.item}>
									{!inResults.has(datum.task!) && (
										<TodosInProgressItem userId={userId} datum={datum} />
									)}
								</React.Fragment>
							)
						})}
					</div>
				</div>
			)}
			<TodosAddForm userId={userId} nextIndex={totalNumTasks} />
		</div>
	)
}
