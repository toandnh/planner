'use client'

import { useState } from 'react'

import useSWRMutation from 'swr/mutation'

export default function TaskItemsUpdateForm({
	userId,
	datum
}: {
	userId: string
	datum: TodoDatum
}) {
	const fetcher = async (url: string, { arg }: { arg: TodoDatum }) =>
		fetch(url, {
			method: 'PUT',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation(`/api/todos?userId=${userId}`, fetcher, {
		revalidate: true
	})

	const [ticked, setTicked] = useState<boolean[]>(
		datum.taskItems!.map((taskItem) => {
			return taskItem[1] as boolean
		})
	)

	const handleTicked = async (index: number) => {
		let updatedTickedArr = ticked.map((item, i) => {
			return i === index ? !item : item
		})
		setTicked(updatedTickedArr)

		const taskItemTuples: (string | boolean)[][] = new Array()
		datum.taskItems!.map((taskItem: (string | boolean)[], i: number) => {
			taskItemTuples.push([taskItem[0], updatedTickedArr[i]])
		})

		await trigger({
			item: datum.item,
			task: datum.task,
			taskItems: taskItemTuples,
			priority: datum.priority,
			completed: datum.completed
		})
	}

	return (
		<>
			{datum.taskItems!.map((taskItem: (string | boolean)[], i: number) => {
				return (
					<div key={`taskItems#${i}#${datum.task}`} className='pl-10'>
						<div className='flex'>
							<label htmlFor={`taskItem#${i}`} className='w-1/2'>
								{taskItem[0]}
							</label>
							<input
								className='w-1/2'
								type='checkbox'
								id={`taskItem#${i}`}
								name='taskItem'
								checked={ticked[i]}
								onChange={() => handleTicked(i)}
							/>
						</div>
					</div>
				)
			})}
		</>
	)
}
