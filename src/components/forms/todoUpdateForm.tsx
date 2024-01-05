'use client'

import { useMemo, useState } from 'react'

import useSWRMutation from 'swr/mutation'
export default function TodoUpdateForm({
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
	const { trigger } = useSWRMutation(`/api/todo?userId=${userId}`, fetcher, {
		revalidate: true
	})

	const numRowLimit = 3

	let index: number = useMemo(() => {
		return parseInt(datum.item!.split('#')[1])
	}, [datum])

	let items: string[] = useMemo(() => {
		let arr: string[] = []
		if (datum.taskItems) {
			datum.taskItems.forEach((taskItem) => {
				arr.push(taskItem[0] as string)
			})
		}
		return arr.concat(Array(numRowLimit).fill(''))
	}, [datum])

	const [stateChanged, setStateChanged] = useState(false)

	const [totalRowLimit, setTotalRowLimit] = useState(numRowLimit)

	const [taskName, setTaskName] = useState(datum.task)
	const [taskPriority, setTaskPriority] = useState(
		parseInt(datum.priority as string)
	)
	const [taskItems, setTaskItems] = useState(items)

	const handleAddMoreItems = (e: React.KeyboardEvent | React.MouseEvent) => {
		// Keyboard stuff here
		if (
			e.type === 'keydown' &&
			((e as React.KeyboardEvent).key === 'Tab' ||
				(e as React.KeyboardEvent).key === 'Shift')
		) {
			return
		}

		// Set new limit every time the function is called
		setTotalRowLimit(totalRowLimit + numRowLimit)
		// Increase the limit of the taskItems array
		setTaskItems([...taskItems, ...Array(numRowLimit).fill('')])
	}

	const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setTaskName(e.target.value)

	const handleTaskPriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		setTaskPriority(5 - e.target.selectedIndex)

	const handleTaskItemChange =
		(index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
			let updatedTaskItems = taskItems.map((item, i) => {
				return i === index ? e.target.value : item
			})
			setTaskItems(updatedTaskItems)
		}

	const handleSubmit = async () => {
		// Turn taskItems into a map
		const taskItemTuples: (string | boolean)[][] = new Array()
		taskItems.map((item) => {
			// Only return non-empty items
			if (item) taskItemTuples.push([item, false])
		})

		await trigger({
			item: `todo#${index}`,
			task: taskName,
			taskItems: taskItemTuples,
			priority: `${taskPriority}`,
			completed: false
		})
	}

	return (
		<div className='bg-gray-400 flex flex-col justify-center gap-5 p-5'>
			<div className='flex flex-col gap-5'>
				<div className='flex'>
					<div className='w-full'>
						<input
							type='text'
							value={taskName}
							name='taskName'
							onChange={handleTaskChange}
							placeholder='Other tasks'
						/>
					</div>
					<div className='w-full'>
						<select
							className='w-1/2'
							value={taskPriority}
							onChange={handleTaskPriorityChange}
							name='priority'
						>
							<option value='5'>Very High</option>
							<option value='4'>High</option>
							<option value='3'>Moderate</option>
							<option value='2'>Low</option>
							<option value='1'>Very Low</option>
						</select>
					</div>
					<div className='w-1/2'>
						<input
							className='bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer hover:disabled:bg-green-100 hover:disabled:cursor-default disabled:bg-green-100'
							type='submit'
							onClick={handleSubmit}
							value='Update'
							disabled={!stateChanged}
						/>
					</div>
				</div>
				{taskItems &&
					taskItems.map((item, i) => {
						return (
							<div key={`row#${i}`} className='pl-20'>
								<input
									type='text'
									value={item}
									name={`taskItems${i}`}
									onChange={handleTaskItemChange(i)}
									placeholder='List item'
								/>
							</div>
						)
					})}
				<div className='w-full flex justify-center'>
					<input
						className='bg-green-300 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
						type='submit'
						onClick={handleAddMoreItems}
						value='Add more items'
					/>
				</div>
			</div>
		</div>
	)
}
