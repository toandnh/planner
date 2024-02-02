'use client'

import { useMemo } from 'react'

import useSWRMutation from 'swr/mutation'

import TodosForm from './todosForm'

export default function TodosUpdateForm({
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

	const numRowLimit = 3

	let items: string[] = useMemo(() => {
		let arr: string[] = []
		if (datum.taskItems) {
			datum.taskItems.forEach((taskItem) => {
				arr.push(taskItem[0] as string)
			})
		}
		return arr.concat(Array(numRowLimit).fill(''))
	}, [datum])

	const initialData = {
		item: datum.item,
		task: datum.task!,
		priority: parseInt(datum.priority!),
		taskItems: items
	}

	return (
		<div className='bg-gray-400 flex flex-col justify-center gap-5 p-5'>
			<TodosForm
				initialData={initialData}
				trigger={trigger}
				numRowLimit={numRowLimit}
			/>
		</div>
	)
}
