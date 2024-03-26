'use client'

import React, { useMemo } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'

import clsx from 'clsx'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import {
	showTaskItems,
	showEdits,
	updateShowEdits
} from '@/lib/features/todos/todosSlice'

import { useMountTransition } from '@/hooks/hooks'

import TaskItemsUpdateForm from './taskItemsUpdateForm'

import TodosUpdateForm from './todosUpdateForm'

import TodosTaskPriorityName from './todosTaskPriorityName'

import TodosCompleteButton from './todosCompleteButton'

import DeleteButton from '@/components/buttons/deleteButton'

import { useMediaQuery } from '@/hooks/hooks'

const priorityMap: { [key: string]: string } = {
	'1': 'bg-emerald-500',
	'2': 'bg-teal-500',
	'3': 'bg-amber-500',
	'4': 'bg-orange-500',
	'5': 'bg-red-500'
}

export default function TodosInProgressItem({
	datum,
	...flippedProps
}: {
	datum: TodoDatum
}) {
	const showItems: boolean =
		useAppSelector(showTaskItems).get(datum.task!) || false
	const showEdit: boolean = useAppSelector(showEdits).get(datum.task!) || false

	const dispatch = useAppDispatch()

	const hasTaskItemsTransitionedIn = useMountTransition(
		showItems && !showEdit,
		150
	)
	const hasEditTransitionedIn = useMountTransition(showEdit, 150)

	const isBreakPoint = useMediaQuery(601)

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
		<div {...flippedProps}>
			<div
				key={datum.item}
				className={clsx(
					'h-full min-h-[35px] flex justify-center items-center z-10',
					isBreakPoint ? 'flex-col gap-5' : ''
				)}
			>
				<TodosTaskPriorityName
					datum={datum}
					color={priorityMap[datum.priority!]}
				/>
				<div className={clsx('flex', isBreakPoint ? 'w-2/3' : 'w-full')}>
					<div className='w-full'>
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
						<TodosCompleteButton datum={datum} />
					</div>
					<div className='w-1/3 flex justify-center items-center'>
						<DeleteButton url={'/api/todos'} item={datum.item} />
					</div>
				</div>
			</div>

			{(hasTaskItemsTransitionedIn || (showItems && !showEdit)) && (
				<div
					className={`${
						hasTaskItemsTransitionedIn && showItems && !showEdit
							? 'opacity-100 translate-y-0 transition-{opactity} duration-200 ease-in transition-{transform} duration-200 ease-in'
							: 'opacity-0 -translate-y-6 transition-{opactity} duration-150 ease-out transition-{transform} duration-150 ease-out'
					}`}
				>
					<TaskItemsUpdateForm datum={datum} />
				</div>
			)}
			{(hasEditTransitionedIn || showEdit) && (
				<div
					className={`${
						hasEditTransitionedIn && showEdit
							? 'opacity-100 translate-y-0 transition-{opactity} duration-200 ease-in transition-{transform} duration-200 ease-in'
							: 'opacity-0 -translate-y-6 transition-{opactity} duration-150 ease-out transition-{transform} duration-150 ease-out'
					}`}
				>
					<TodosUpdateForm datum={datum} />
				</div>
			)}
		</div>
	)
}
