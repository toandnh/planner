'use client'

import useSWRMutation from 'swr/mutation'

import CloseIcon from '@mui/icons-material/Close'

import TodosForm from './todosForm'

import { useToggle } from '@/hooks/useToggle'

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

	const Form: React.ReactNode = (
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
			{opened && Form}
		</>
	)
}
