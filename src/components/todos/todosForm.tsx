'use client'

import { useEffect, useState } from 'react'

type InitialData = {
	item: string
	task: string
	priority: number
	taskItems: string[]
}

export default function TodosForm({
	initialData,
	trigger,
	numRowLimit
}: {
	initialData: InitialData
	trigger: Function
	numRowLimit: number
}) {
	const [stateChanged, setStateChanged] = useState(false)

	const [totalRowLimit, setTotalRowLimit] = useState(numRowLimit)

	const [taskName, setTaskName] = useState(initialData.task)
	const [taskPriority, setTaskPriority] = useState(initialData.priority)
	const [taskItems, setTaskItems] = useState(initialData.taskItems)

	useEffect(() => {
		let taskNameChanged = taskName !== initialData.task
		let taskPriorityChanged = taskPriority !== initialData.priority
		// So that pressing "Add more items" button will not enable the button
		let taskItemsChanged = isEqualArray(initialData.taskItems, taskItems)

		let dataChanged = taskNameChanged || taskPriorityChanged || taskItemsChanged
		// If any of the dependencies changed, then enable the trigger button
		setStateChanged(taskName && dataChanged ? true : false)
	}, [taskName, taskItems, taskPriority])

	const isEqualArray = (arr1: string[], arr2: string[]) => {
		// arr1 should always be in the form ['data1', 'data2', '', '', '']

		let hasChanged = false
		let index = 0

		// Compare all the non-empty data in arr1 with arr2
		for (const item of arr1) {
			if (item == '') break
			hasChanged = item !== arr2[index]
			index++
		}
		if (hasChanged) return true

		// If arr2 has non-empty data beyond 'index'
		for (let i = index; i < arr2.length; i++) {
			if (arr2[i] !== '') return true
		}

		return hasChanged
	}

	const handleAddMoreItems = () => {
		// Set new limit every time the function is called
		setTotalRowLimit(totalRowLimit + numRowLimit)
		// Increase the limit of the taskItems array
		setTaskItems(
			taskItems
				? [...taskItems, ...Array(numRowLimit).fill('')]
				: Array(numRowLimit).fill('')
		)
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
			item: initialData.item,
			task: taskName,
			taskItems: taskItemTuples,
			priority: `${taskPriority}`,
			completed: false
		})

		// Reset input fields
		setTaskName(initialData.task)
		setTaskItems(initialData.taskItems)
		setTaskPriority(initialData.priority)
	}

	return (
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
			{taskItems.map((item, i) => {
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
	)
}
