'use client'

import { useMemo, useState } from 'react'

import useSWRMutation from 'swr/mutation'

import CloseIcon from '@mui/icons-material/Close'

export default function ToDoAddForm() {
	const numRowLimit = 3

	const [totalRowLimit, setTotalRowLimit] = useState(3)
	// A switch to signal useMemo() update
	const [update, setUpdate] = useState(false)
	const [opened, setOpened] = useState(false)

	const [task, setTask] = useState('')
	const [taskItems, setTaskItems] = useState<string[]>([])

	const fetcher = async (url: string, { arg }: { arg: { item: string } }) =>
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { data, trigger } = useSWRMutation('/api/todo', fetcher, {
		revalidate: true
	})

	const toggleUpdate = () => setUpdate(!update)

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
		// And reset the items array to contain only numRowLimit items
		toggleUpdate()
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

		toggleUpdate()
	}

	const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setTask(e.target.value)

	const handleTaskItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// data-key in the form 'row#i'
		const index = parseInt(
			e.target.getAttribute('data-key')?.split('#')[1] as string
		)
		const updatedTaskItems = taskItems.map((item, i) => {
			if (i === index) return e.target.value
			return item
		})
		setTaskItems(updatedTaskItems)
	}

	const getRows = () => {
		let rows: React.ReactNode[] = []
		for (let i = 0; i < totalRowLimit; i++) {
			let row = (
				<tr key={`row#${i}`} data-key={`row#${i}`}>
					<td className='pl-20'>
						<input
							type='text'
							value={taskItems[i]}
							name={`row#${i}`}
							onChange={handleTaskItemChange}
							placeholder='List item'
						/>
					</td>
				</tr>
			)
			rows.push(row)
		}
		// Set new limit every time the function is called
		setTotalRowLimit(totalRowLimit + numRowLimit)
		return rows
	}

	let items: React.ReactNode[] = useMemo(() => getRows(), [update])

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
							value={task}
							name='new-task'
							onChange={handleTaskChange}
							placeholder='Other tasks'
						/>
					</td>
					<td className='w-full'>
						<select className='w-1/2' name='priority'>
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
							value='Add'
						/>
					</td>
					<td className='w-1/2'>
						<span className='hidden' />
					</td>
				</tr>
				{items.map((row) => row)}
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
