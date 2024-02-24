'use client'

import useSWRMutation from 'swr/mutation'

import CloseIcon from '@mui/icons-material/Close'

import TodosForm from './todosForm'

import { useMountTransition, useToggle } from '@/hooks/hooks'

export default function TodosAddForm() {
	const fetcher = async (url: string, { arg }: { arg: TodoDatum }) =>
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation('/api/todos', fetcher, {
		revalidate: true
	})

	const numRowLimit = 3

	const [opened, toggle] = useToggle(false)
	const hasTransitionedIn = useMountTransition(opened, 150)

	const AddMoreButton: React.ReactNode = (
		<div className='w-full flex justify-center pb-5'>
			<input
				className='w-1/2 bg-green-300 flex items-center justify-center px-2 rounded-md hover:bg-green-400 hover:cursor-pointer'
				type='button'
				onClick={toggle}
				value='Add More'
			/>
		</div>
	)

	const initialData = {
		item: `todos#${new Date().getTime()}`,
		task: '',
		priority: 5,
		taskItems: Array(numRowLimit).fill('')
	}

	const form: React.ReactNode = (
		<div className='bg-bone/70 flex flex-col justify-center rounded-md gap-5 p-5'>
			<div className='w-full flex justify-end'>
				<button onClick={toggle}>
					<CloseIcon fontSize='medium' />
				</button>
			</div>
			<TodosForm
				initialData={initialData}
				trigger={trigger}
				numRowLimit={numRowLimit}
			/>
		</div>
	)

	return (
		<>
			{!opened && AddMoreButton}
			{(hasTransitionedIn || opened) && (
				<div
					className={`${
						hasTransitionedIn && opened
							? 'opacity-100 translate-y-0 transition-{opactity} duration-200 ease-in transition-{transform} duration-200 ease-in'
							: 'opacity-0 -translate-y-6 transition-{opactity} duration-150 ease-out transition-{transform} duration-150 ease-out'
					}`}
				>
					{form}
				</div>
			)}
		</>
	)
}
