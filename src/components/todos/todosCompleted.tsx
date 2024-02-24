'use client'

import React, { useEffect, useState } from 'react'

import { Flipper, Flipped } from 'react-flip-toolkit'

import { useAppSelector } from '@/lib/hooks'

import { inSearchResults } from '@/lib/features/todos/todosSlice'

import TodosCompletedItem from './todosCompletedItem'

import { sortByTaskNameAsc, getFlipKey } from '../utilities/utilities'

export default function TodosCompleted({
	isLoading,
	data
}: {
	isLoading: boolean
	data: TodoDatum[]
}) {
	const [sortedData, setSortedData] = useState<TodoDatum[]>([])

	const [flipKey, setFlipKey] = useState('')

	const inResults: Set<string> = useAppSelector(inSearchResults)

	useEffect(() => {
		let returnData: TodoDatum[] = sortByTaskNameAsc(data)
		setSortedData(returnData)
		setFlipKey(getFlipKey(returnData))
	}, [data])

	return (
		<div className='h-full w-full flex flex-col gap-5'>
			<h3 className='text-xl font-semibold'>Completed</h3>
			<Flipper flipKey={flipKey}>
				<div className='flex flex-col gap-3 pl-5 pt-5 pb-5'>
					{!isLoading &&
						sortedData.map((datum: TodoDatum) => {
							return (
								<Flipped key={datum.item} flipId={datum.item}>
									{!inResults.has(datum.task!) && (
										<TodosCompletedItem datum={datum} />
									)}
								</Flipped>
							)
						})}
				</div>
			</Flipper>
		</div>
	)
}
