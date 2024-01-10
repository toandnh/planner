import React, { useEffect, useMemo, useState } from 'react'

import TodoInProgressItem from './todoInProgressItem'

import TodoAddForm from '@/components/todo/todoAddForm'

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
									<TodoInProgressItem
										userId={userId}
										datum={datum}
										handleShowEditClick={handleShowEditClick}
										handleShowMoreClick={handleShowMoreClick}
										completeness={completeness}
										showEdits={showEdits}
										showItems={showItems}
									/>
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
