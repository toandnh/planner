'use client'

import { useEffect, useState } from 'react'

import useSWRMutation from 'swr/mutation'

import CloseIcon from '@mui/icons-material/Close'

import TodoForm from './todoForm'

export default function TodoAddForm({
	userId,
	nextIndex
}: {
	userId: string
	nextIndex: number
}) {
	const numRowLimit = 3

	const [stateChanged, setStateChanged] = useState(false)

	const [totalRowLimit, setTotalRowLimit] = useState(numRowLimit)
	const [opened, setOpened] = useState(false)

	const [taskName, setTaskName] = useState('')
	const [taskPriority, setTaskPriority] = useState(5)
	const [taskItems, setTaskItems] = useState<string[]>([])

	const fetcher = async (url: string, { arg }: { arg: TodoDatum }) =>
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { data, trigger } = useSWRMutation(
		`/api/todo?userId=${userId}`,
		fetcher,
		{ revalidate: true }
	)

	useEffect(() => {
		// If taskName has been set, then enable the trigger button
		setStateChanged(taskName ? true : false)
	}, [taskName])

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
			item: `todo#${nextIndex}`,
			task: taskName,
			taskItems: taskItemTuples,
			priority: `${taskPriority}`,
			completed: false
		})

		// Empty input fields
		setTaskName('')
		setTaskItems(Array(numRowLimit).fill(''))
		setTaskPriority(5)
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
		<div className='bg-gray-400 flex flex-col justify-center gap-5 p-5'>
			<div className='w-full flex justify-end'>
				<button onClick={toggleDrawer}>
					<CloseIcon fontSize='large' />
				</button>
			</div>
			<TodoForm
				datum={{ task: taskName!, priority: taskPriority, taskItems }}
				handleSubmit={handleSubmit}
				handleTaskChange={handleTaskChange}
				handleTaskPriorityChange={handleTaskPriorityChange}
				handleAddMoreItems={handleAddMoreItems}
				handleTaskItemChange={handleTaskItemChange}
				stateChanged={stateChanged}
			/>
		</div>
	)

	return (
		<>
			{!opened && AddMoreButton}
			{opened && Form}
		</>
	)
}
