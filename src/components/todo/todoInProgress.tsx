import React, { useEffect, useMemo, useState } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'

import TaskItemsUpdateForm from '@/components/todo/taskItemsUpdateForm'

import TodoAddForm from '@/components/todo/todoAddForm'
import TodoUpdateForm from '@/components/todo/todoUpdateForm'

import TodoTaskPriorityName from './todoTaskPriorityName'

import TodoDeleteButton from '@/components/todo/todoDeleteButton'
import TodoCompleteButton from '@/components/todo/todoCompleteButton'

const priorityMapping = new Map<string, string>([
	['1', 'bg-green-600'],
	['2', 'bg-lime-600'],
	['3', 'bg-yellow-600'],
	['4', 'bg-orange-600'],
	['5', 'bg-red-600']
])

export default function TodoInProgress({
	userId,
	isLoading,
	data,
	handleShowMoreClick,
	showItems
}: {
	userId: string
	isLoading: boolean
	data: TodoDatum[]
	handleShowMoreClick: Function
	showItems: Map<string, boolean>
}) {
	const [showEdits, setShowEdits] = useState<Map<string, boolean>>(new Map())
	const [completeness, setCompleteness] = useState<Map<string, number>>(
		new Map()
	)

	const totalNumTasks: number = useMemo(() => {
		return !isLoading ? data.length : 0
	}, [data])

	const completePercentMap: Map<string, number> = useMemo(() => {
		let completePercentages = new Map()
		if (!isLoading) {
			data.map((datum: any) => {
				if (datum.taskItems) {
					let count = 0
					datum.taskItems.map((taskItem: (string | boolean)[]) => {
						if (taskItem[1] as boolean) count++
					})
					let percentage = Math.round((count / datum.taskItems.length) * 100)
					completePercentages.set(datum.task, percentage)
				} else {
					completePercentages.set(datum.task, 0)
				}
			})
		}
		return completePercentages
	}, [data])

	useEffect(() => {
		setCompleteness(completePercentMap)
	}, [data])

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
		<div className='h-full w-full flex flex-col gap-10'>
			<h3 className='justify-start text-xl font-semibold'>In Progress</h3>
			{!isLoading && (
				<div className='flex flex-col justify-center gap-10 pl-5 pt-5'>
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
									{!datum.completed && (
										<>
											<div key={datum.item} className='h-full flex'>
												<TodoTaskPriorityName
													datum={datum}
													handleShowMoreClick={handleShowMoreClick}
													color={priorityMapping.get(datum.priority!)!}
												/>
												<div className='w-full flex flex-row gap-5'>
													<progress
														className='w-2/3 rounded-md'
														max='100'
														value={completeness.get(datum.task!)}
													>
														{`${completeness.get(datum.task!)}%`}
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
													<TodoDeleteButton
														userId={userId}
														item={datum.item!}
													/>
												</div>
												<div className='w-1/3 flex justify-center items-center'>
													<TodoCompleteButton userId={userId} datum={datum} />
												</div>
											</div>
											{showItems.get(datum.task!) &&
												!showEdits.get(datum.task!) && (
													<TaskItemsUpdateForm userId={userId} datum={datum} />
												)}
											{showEdits.get(datum.task!) && (
												<TodoUpdateForm userId={userId} datum={datum} />
											)}
										</>
									)}
								</React.Fragment>
							)
						})}
					</div>
				</div>
			)}
			<TodoAddForm userId={userId} nextIndex={totalNumTasks} />
		</div>
	)
}
