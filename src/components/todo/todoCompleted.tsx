import React from 'react'

import useSWRMutation from 'swr/mutation'

import RestoreIcon from '@mui/icons-material/Restore'

import TodoTaskPriorityName from './todoTaskPriorityName'

export default function TodoCompleted({
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
	const fetcher = async (url: string, { arg }: { arg: TodoDatum }) =>
		fetch(url, {
			method: 'PUT',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation(`/api/todo?userId=${userId}`, fetcher, {
		revalidate: true
	})

	const handleRestoreClick =
		(datum: TodoDatum) => async (e: React.MouseEvent<HTMLButtonElement>) => {
			await trigger({
				item: datum.item,
				task: datum.task,
				taskItems: datum.taskItems,
				priority: `${datum.priority}`,
				completed: false
			})
		}

	return (
		<div className='h-full w-full'>
			<h3 className='justify-start text-xl font-semibold pb-5'>Completed</h3>
			<div className='flex flex-col gap-3 pl-5'>
				{!isLoading &&
					data.map((datum: any) => {
						return (
							<React.Fragment key={datum.item}>
								{datum.completed && (
									<>
										<div className='min-h-[35px] flex'>
											<TodoTaskPriorityName
												datum={datum}
												handleShowMoreClick={handleShowMoreClick}
												color='bg-neutral-400'
											/>
											<button onClick={handleRestoreClick(datum)}>
												<RestoreIcon fontSize='large' />
											</button>
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
										{showItems.get(datum.task!) &&
											datum.taskItems.map(
												(taskItem: (string | boolean)[], i: number) => {
													return (
														<div
															key={`taskItems#${i}#${datum.task}`}
															className='flex pl-10'
														>
															{taskItem[0]}
														</div>
													)
												}
											)}
									</>
								)}
							</React.Fragment>
						)
					})}
			</div>
		</div>
	)
}
