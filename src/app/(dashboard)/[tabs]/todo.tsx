'use client'

import React from 'react'

import { useEffect, useMemo, useState } from 'react'

import { useSession } from 'next-auth/react'

import useSWR from 'swr'

import clsx from 'clsx'

import TaskItemsUpdateForm from '@/components/forms/taskItemsUpdateForm'

import TodoAddForm from '@/components/forms/todoAddForm'
import TodoUpdateForm from '@/components/forms/todoUpdateForm'

const priorityMapping = new Map<string, string>([
	['1', 'bg-green-600'],
	['2', 'bg-lime-600'],
	['3', 'bg-yellow-600'],
	['4', 'bg-orange-600'],
	['5', 'bg-red-600']
])

export default function Todo() {
	const { data: session, status } = useSession()

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR(
		`/api/todo?userId=${session?.user.id}`,
		fetcher
	)

	const [showEdits, setShowEdits] = useState<Map<string, boolean>>(new Map())
	const [showItems, setShowItems] = useState<Map<string, boolean>>(new Map())
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
		(taskName: string) => (e: React.MouseEvent<HTMLInputElement>) => {
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

	const handleShowMoreClick =
		(taskName: string) => (e: React.MouseEvent<HTMLInputElement>) => {
			let updatedShowItemsMap = new Map(
				showItems.set(taskName, !showItems.get(taskName))
			)
			setShowItems(updatedShowItemsMap)
		}

	return (
		<div className='h-full w-full flex flex-col items-center gap-10 p-10 border-l-2'>
			<h2 className='text-xl font-semibold'>To-do List</h2>

			<input
				className='w-full rounded-md p-2'
				type='text'
				name='search'
				placeholder='Search...'
			/>

			<div className='h-full w-full flex flex-col gap-10'>
				<h3 className='justify-start text-xl font-semibold'>In Progress</h3>
				{!isLoading && (
					<div className='flex flex-col justify-center gap-10 pl-5 pt-5'>
						<div className='flex'>
							<div className='w-full flex justify-start font-semibold'>
								Task
							</div>
							<div className='w-full flex justify-start font-semibold'>
								Priority
							</div>
							<div className='w-full flex justify-start font-semibold'>
								Progress
							</div>
							<div className='w-1/3 flex justify-start font-semibold'>
								<p className='hidden'>HIDDEN</p>
							</div>
							<div className='w-1/3 flex justify-start font-semibold'>
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
													<div className='w-full'>
														{!datum.taskItems && (
															<p key={datum.item}>{datum.task}</p>
														)}
														{datum.taskItems && (
															<input
																className='hover:cursor-pointer'
																key={datum.item}
																type='button'
																onClick={handleShowMoreClick(datum.task!)}
																value={`${datum.task}`}
															/>
														)}
													</div>
													<div className='w-full'>
														<span
															key={datum.item}
															className={clsx(
																priorityMapping.get(datum.priority!),
																'inline-block h-full w-1/2'
															)}
														></span>
													</div>
													<div className='w-full flex flex-row gap-5'>
														<div
															// Something is very wrong here with the conic-gradient...
															className={clsx(
																'w-[30px] h-[30px] rounded-full',
																`bg-[radial-gradient(closest-side,_white_75%,_transparent_80%_100%),_conic-gradient(hotpink_${completeness.get(
																	datum.task!
																)}%,_pink_0)]`
															)}
														>
															<p className='w-full h-full flex justify-center items-center text-xs'>
																{completeness.get(datum.task!)}%
															</p>
														</div>
													</div>
													<div className='w-1/3'>
														<input
															className='bg-orange-500 flex items-end justify-center px-2 rounded-md hover:bg-orange-600 hover:cursor-pointer'
															key={datum.item}
															type='button'
															onClick={handleShowEditClick(datum.task!)}
															value={
																showEdits.get(datum.task!) ? 'Exit' : 'Edit'
															}
														/>
													</div>
													<div className='w-1/3'>
														<input
															className='bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
															key={datum.item}
															type='button'
															value='Done'
														/>
													</div>
												</div>
												{showItems.get(datum.task!) &&
													!showEdits.get(datum.task!) && (
														<TaskItemsUpdateForm
															userId={session?.user.id}
															datum={datum}
														/>
													)}
												{showEdits.get(datum.task!) && (
													<TodoUpdateForm
														userId={session?.user.id}
														datum={datum}
													/>
												)}
											</>
										)}
									</React.Fragment>
								)
							})}
						</div>
					</div>
				)}
				<TodoAddForm userId={session?.user.id} nextIndex={totalNumTasks} />
			</div>

			<div className='h-full w-full'>
				<h3 className='justify-start text-xl font-semibold pb-5'>Completed</h3>
				<div className='flex flex-col gap-3 pl-5'>
					{!isLoading &&
						data.map((record: any) => {
							if (record.completed)
								return <p key={record.item}>{record.task}</p>
						})}
				</div>
			</div>
		</div>
	)
}
