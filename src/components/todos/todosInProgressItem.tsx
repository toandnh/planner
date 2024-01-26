'use client'

import React, { useMemo, useState } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'

import { useAppSelector } from '@/lib/hooks'

import { showTaskItems } from '@/lib/features/todos/todosSlice'

import TaskItemsUpdateForm from './taskItemsUpdateForm'

import TodosUpdateForm from './todosUpdateForm'

import TodosTaskPriorityName from './todosTaskPriorityName'

import TodosDeleteButton from './todosDeleteButton'
import TodosCompleteButton from './todosCompleteButton'

const priorityMapping = new Map<string, string>([
	['1', 'bg-green-600'],
	['2', 'bg-lime-600'],
	['3', 'bg-yellow-600'],
	['4', 'bg-orange-600'],
	['5', 'bg-red-600']
])

export default function TodosInProgressItem({
	userId,
	datum
}: {
	userId: string
	datum: TodoDatum
}) {
	const showItems = useAppSelector(showTaskItems)

	const [showEdits, setShowEdits] = useState<Map<string, boolean>>(new Map())

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

	const handleShowEditClick =
		(taskName: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
			// Clone the current map and toggle the current key
			let updatedShowEditMap = new Map(
				showEdits.set(taskName, !showEdits.get(taskName))
			)
			// Set all others key to false
			updatedShowEditMap.forEach((value: boolean, key: string) => {
				if (key != taskName) {
					updatedShowEditMap.set(key, false)
				}
			})
			setShowEdits(updatedShowEditMap)
		}

	return (
		<>
			<div key={datum.item} className='h-full flex'>
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
					<button onClick={handleShowEditClick(datum.task!)}>
						{showEdits.get(datum.task!) ? (
							<CloseIcon fontSize='large' />
						) : (
							<EditIcon fontSize='large' />
						)}
					</button>
				</div>
				<div className='w-1/3'>
					<TodosDeleteButton userId={userId} item={datum.item!} />
				</div>
				<div className='w-1/3 flex justify-center items-center'>
					<TodosCompleteButton userId={userId} datum={datum} />
				</div>
			</div>
			{showItems.get(datum.task!) && !showEdits.get(datum.task!) && (
				<TaskItemsUpdateForm userId={userId} datum={datum} />
			)}
			{showEdits.get(datum.task!) && (
				<TodosUpdateForm userId={userId} datum={datum} />
			)}
		</>
	)
}
