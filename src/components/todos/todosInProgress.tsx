'use client'

import React, { useMemo, useState } from 'react'

import SwapVertIcon from '@mui/icons-material/SwapVert'

import { useAppSelector } from '@/lib/hooks'

import { inSearchResults } from '@/lib/features/todos/todosSlice'

import TodosInProgressItem from './todosInProgressItem'
import TodosAddForm from './todosAddForm'

import {
	sortByTaskNameAsc,
	sortByTaskNameDsc,
	sortByTaskPriorityAsc,
	sortByTaskPriorityDsc
} from '../utilities/utilities'

export default function TodosInProgress({
	isLoading,
	data
}: {
	isLoading: boolean
	data: TodoDatum[]
}) {
	const [taskNameAsc, setTaskNameAsc] = useState(false)
	const [taskPriorityAsc, setTaskPriorityAsc] = useState(false)

	const [sortBy, setSortBy] = useState('tasK-priority')

	const inResults = useAppSelector(inSearchResults)

	let sortedData: TodoDatum[] = useMemo(() => {
		if (sortBy == 'task-name') {
			return taskNameAsc ? sortByTaskNameAsc(data) : sortByTaskNameDsc(data)
		} else {
			return taskPriorityAsc
				? sortByTaskPriorityAsc(data)
				: sortByTaskPriorityDsc(data)
		}
	}, [data])

	const handlePrioritySort = () => {
		sortedData = taskPriorityAsc
			? sortByTaskPriorityDsc(data)
			: sortByTaskPriorityAsc(data)
		setSortBy('task-priority')
		setTaskPriorityAsc(!taskPriorityAsc)
		// So that next click on sortTaskName data will render in ascending order
		setTaskNameAsc(false)
	}

	const handleTaskNameSort = () => {
		sortedData = taskNameAsc ? sortByTaskNameDsc(data) : sortByTaskNameAsc(data)
		setSortBy('task-name')
		setTaskNameAsc(!taskNameAsc)
		// So that next click on sortTaskPriority data will render in descending order
		setTaskPriorityAsc(true)
	}

	return (
		<div className='h-full w-full flex flex-col gap-5'>
			<h3 className='text-xl font-semibold'>In Progress</h3>
			{!isLoading && (
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
					<div className='flex flex-col gap-5'>
						{sortedData.map((datum: TodoDatum) => {
							return (
								<React.Fragment key={datum.item}>
									{!inResults.has(datum.task!) && (
										<TodosInProgressItem datum={datum} />
									)}
								</React.Fragment>
							)
						})}
					</div>
				</div>
			)}
			<TodosAddForm />
		</div>
	)
}
