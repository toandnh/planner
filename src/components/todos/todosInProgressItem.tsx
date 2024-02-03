'use client'

import React, { useMemo } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import {
	showTaskItems,
	showEdits,
	updateShowEdits
} from '@/lib/features/todos/todosSlice'

import TaskItemsUpdateForm from './taskItemsUpdateForm'

import TodosUpdateForm from './todosUpdateForm'

import TodosTaskPriorityName from './todosTaskPriorityName'

import TodosCompleteButton from './todosCompleteButton'

import DeleteButton from '@/components/buttons/deleteButton'

const priorityMapping = new Map<string, string>([
	['1', 'bg-green-600'],
	['2', 'bg-lime-600'],
	['3', 'bg-yellow-600'],
	['4', 'bg-orange-600'],
	['5', 'bg-red-600']
])

export default function TodosInProgressItem({ datum }: { datum: TodoDatum }) {
	const showItems: boolean =
		useAppSelector(showTaskItems).get(datum.task!) || false
	const showEdit: boolean = useAppSelector(showEdits).get(datum.task!) || false

	const dispatch = useAppDispatch()

	const completePercentage: number = useMemo(() => {
		let percent: number = 0
		// taskItems return empty array if there are no items
		if (datum.taskItems.length > 0) {
			let count = 0
			datum.taskItems.map((taskItem: (string | boolean)[]) => {
				if (taskItem[1] as boolean) count++
			})
			percent = Math.round((count / datum.taskItems.length) * 100)
		}
		return percent
	}, [datum])

	const handleShowEdit = () =>
		dispatch(updateShowEdits({ taskName: datum.task, editOpened: !showEdit }))

	return (
		<>
			<div
				key={datum.item}
				className='h-full min-h-[35px] flex justify-center items-center'
			>
				<TodosTaskPriorityName
					datum={datum}
					color={priorityMapping.get(datum.priority!)!}
				/>
				<div className='w-full flex flex-row gap-5'>
					<progress
						className='w-2/3 rounded-md'
						max='100'
						value={completePercentage}
					>
						{`${completePercentage}%`}
					</progress>
				</div>
				<div className='w-1/3'>
					<button onClick={handleShowEdit}>
						{showEdit ? (
							<CloseIcon fontSize='medium' />
						) : (
							<EditIcon fontSize='medium' />
						)}
					</button>
				</div>
				<div className='w-1/3'>
					<DeleteButton url={'/api/todos'} item={datum.item!} />
				</div>
				<div className='w-1/3 flex justify-center items-center'>
					<TodosCompleteButton datum={datum} />
				</div>
			</div>
			{showItems && !showEdit && <TaskItemsUpdateForm datum={datum} />}
			{showEdit && <TodosUpdateForm datum={datum} />}
		</>
	)
}
