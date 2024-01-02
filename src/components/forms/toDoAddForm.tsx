'use client'

import { useState } from 'react'

import useSWRMutation from 'swr/mutation'

import CloseIcon from '@mui/icons-material/Close'

export default function ToDoAddForm({
	userId,
	numItems
}: {
	userId: string
	numItems: number
}) {
	const numRowLimit = 3

	const [totalRowLimit, setTotalRowLimit] = useState(3)
	const [opened, setOpened] = useState(false)

	const [taskName, setTaskName] = useState('')
	const [taskPriority, setTaskPriority] = useState(5)
	const [taskItems, setTaskItems] = useState<string[]>([])

	const fetcher = async (
		url: string,
		{
			arg
		}: {
			arg: {
				taskId: string
				taskName: string
				taskItems: (string | boolean)[][]
				taskPriority: number
				taskCompleted: boolean
			}
		}
	) =>
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { data, trigger } = useSWRMutation(
		`/api/todo?userId=${userId}`,
		fetcher,
		{ revalidate: true }
	)

	const toggleDrawer = (e: React.KeyboardEvent | React.MouseEvent) => {
		// Keyboard stuff here
		if (
			e.type === 'keydown' &&
			((e as React.KeyboardEvent).key === 'Tab' ||
				(e as React.KeyboardEvent).key === 'Shift')
		) {
			return
		}

		setOpened(!opened)

		// Signal the reset of totalRowLimit;
		setTotalRowLimit(numRowLimit)
		// Reset taskItems array
		setTaskItems(Array(numRowLimit).fill(''))
	}

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
			console.log(updatedTaskItems)
			setTaskItems(updatedTaskItems)
		}

	const handleSubmit = async () => {
		// Turn taskItems into a map
		const taskItemTuples: (string | boolean)[][] = new Array()
		taskItems.map((item) => {
			// Only return non-empty items
			if (item) taskItemTuples.push([item, false])
		})

		console.log(`todo#${numItems}`, taskName, taskItems, taskPriority)
		console.log(taskItemTuples)

		await trigger({
			taskId: `todo#${numItems}`,
			taskName: taskName,
			taskItems: taskItemTuples,
			taskPriority: taskPriority,
			taskCompleted: false
		})
	}

	const AddMoreButton: React.ReactNode = (
		<div className='w-full flex justify-center'>
			<input
				className='w-1/2 bg-green-500 flex items-center justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
				type='button'
				onClick={toggleDrawer}
				value='Add More'
			/>
		</div>
	)

	const Form: React.ReactNode = (
		<table className='bg-gray-400 flex flex-col justify-center gap-5 p-5'>
			<thead className='w-full flex justify-end'>
				<tr>
					<td>
						<button onClick={toggleDrawer}>
							<CloseIcon fontSize='large' />
						</button>
					</td>
				</tr>
			</thead>
			<tbody className='flex flex-col gap-5'>
				<tr className='flex'>
					<td className='w-full'>
						<input
							type='text'
							value={taskName}
							name='taskName'
							onChange={handleTaskChange}
							placeholder='Other tasks'
						/>
					</td>
					<td className='w-full'>
						<select
							className='w-1/2'
							onChange={handleTaskPriorityChange}
							name='priority'
						>
							<option value='veryHigh'>Very High</option>
							<option value='high'>High</option>
							<option value='moderate'>Moderate</option>
							<option value='low'>Low</option>
							<option value='veryLow'>Very Low</option>
						</select>
					</td>
					<td className='w-1/2'>
						<input
							className='bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
							type='submit'
							onClick={handleSubmit}
							value='Add'
						/>
					</td>
					<td className='w-1/2'>
						<span className='hidden' />
					</td>
				</tr>
				{taskItems.map((item, i) => {
					return (
						<tr key={`row#${i}`}>
							<td className='pl-20'>
								<input
									type='text'
									value={item}
									name={`taskItems${i}`}
									onChange={handleTaskItemChange(i)}
									placeholder='List item'
								/>
							</td>
						</tr>
					)
				})}
				<tr>
					<td className='w-full flex justify-center'>
						<input
							className='bg-green-300 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
							type='submit'
							onClick={handleAddMoreItems}
							value='Add more items'
						/>
					</td>
				</tr>
			</tbody>
		</table>
	)

	return (
		<>
			{!opened && AddMoreButton}
			{opened && Form}
		</>
	)
}
