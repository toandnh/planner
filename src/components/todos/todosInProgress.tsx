'use client'

import React, { useEffect, useState } from 'react'

import { Flipper, Flipped } from 'react-flip-toolkit'

import CircularProgress from '@mui/material/CircularProgress'

import SwapVertIcon from '@mui/icons-material/SwapVert'

import { useAppSelector } from '@/lib/hooks'

import { inSearchResults } from '@/lib/features/todos/todosSlice'

import TodosInProgressItem from './todosInProgressItem'
import TodosAddForm from './todosAddForm'

import {
	sortByTaskNameAsc,
	sortByTaskNameDsc,
	sortByTaskPriorityAsc,
	sortByTaskPriorityDsc,
	getFlipKey
} from '../utilities/utilities'

export default function TodosInProgress({
	isLoading,
	data
}: {
	isLoading: boolean
	data: TodoDatum[]
}) {
	const [sortedData, setSortedData] = useState<TodoDatum[]>([])

	const [taskNameAsc, setTaskNameAsc] = useState(false)
	const [taskPriorityAsc, setTaskPriorityAsc] = useState(false)

	const [flipKey, setFlipKey] = useState('')

	const [sortBy, setSortBy] = useState('tasK-priority')

	const inResults: Set<string> = useAppSelector(inSearchResults)

	useEffect(() => {
		let returnData: TodoDatum[] = []
		if (sortBy == 'task-name') {
			returnData = taskNameAsc
				? sortByTaskNameAsc(data)
				: sortByTaskNameDsc(data)
		} else {
			returnData = taskPriorityAsc
				? sortByTaskPriorityAsc(data)
				: sortByTaskPriorityDsc(data)
		}
		setSortedData(returnData)
		setFlipKey(getFlipKey(returnData))
	}, [data])

	const handlePrioritySort = () => {
		let returnData: TodoDatum[] = taskPriorityAsc
			? sortByTaskPriorityDsc(data)
			: sortByTaskPriorityAsc(data)
		setSortedData(returnData)
		setFlipKey(getFlipKey(returnData))

		setSortBy('task-priority')
		setTaskPriorityAsc(!taskPriorityAsc)
		// So that next click on sortTaskName data will render in ascending order
		setTaskNameAsc(false)
	}

	const handleTaskNameSort = () => {
		let returnData: TodoDatum[] = taskNameAsc
			? sortByTaskNameDsc(data)
			: sortByTaskNameAsc(data)
		setSortedData(returnData)
		setFlipKey(getFlipKey(returnData))

		setSortBy('task-name')
		setTaskNameAsc(!taskNameAsc)
		// So that next click on sortTaskPriority data will render in descending order
		setTaskPriorityAsc(true)
	}

	return (
		<div className='h-full w-full flex flex-col gap-5'>
			<h3 className='text-xl font-semibold'>In Progress</h3>
			<Flipper flipKey={flipKey}>
				<div className='flex flex-col justify-center gap-10 pl-5 pt-5 pb-5'>
					<div className='flex'>
						<div className='w-1/3 flex justify-start font-semibold'>
							<button onClick={handlePrioritySort}>
								<SwapVertIcon fontSize='small' />
							</button>
						</div>
						<div className='w-full flex justify-start gap-3 font-semibold'>
							Task
							<button onClick={handleTaskNameSort}>
								<SwapVertIcon fontSize='small' />
							</button>
						</div>
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
					{!isLoading && (
						<div className='flex flex-col gap-5'>
							{sortedData.length == 0 && (
								<div className='flex justify-center font-normal italic'>
									No items here!
								</div>
							)}
							{sortedData.map((datum: TodoDatum) => {
								return (
									<Flipped key={datum.item} flipId={datum.item}>
										{!inResults.has(datum.task!) && (
											<TodosInProgressItem datum={datum} />
										)}
									</Flipped>
								)
							})}
						</div>
					)}
					{isLoading && (
						<div className='flex justify-center items-center'>
							<CircularProgress />
						</div>
					)}
				</div>
			</Flipper>
			{!isLoading && <TodosAddForm />}
		</div>
	)
}
