'use client'

import { useState } from 'react'

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
	const fetcher = async (url: string, { arg }: { arg: TodoDatum }) =>
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation(`/api/todo?userId=${userId}`, fetcher, {
		revalidate: true
	})

	const numRowLimit = 3

	const [opened, setOpened] = useState(false)

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

	const initialData = {
		task: '',
		priority: 5,
		taskItems: Array(numRowLimit).fill('')
	}

	const Form: React.ReactNode = (
		<div className='bg-gray-400 flex flex-col justify-center gap-5 p-5'>
			<div className='w-full flex justify-end'>
				<button onClick={toggleDrawer}>
					<CloseIcon fontSize='large' />
				</button>
			</div>
			<TodoForm
				initialData={initialData}
				trigger={trigger}
				index={nextIndex}
				numRowLimit={numRowLimit}
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
