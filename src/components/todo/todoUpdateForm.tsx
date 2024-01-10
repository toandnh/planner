'use client'

import { useMemo } from 'react'

import useSWRMutation from 'swr/mutation'

import TodoForm from './todoForm'

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

	return (
		<div className='bg-gray-400 flex flex-col justify-center gap-5 p-5'>
			<TodoForm
				initialData={{
					task: datum.task!,
					priority: parseInt(datum.priority!),
					taskItems: items
				}}
				trigger={trigger}
				index={index}
				numRowLimit={numRowLimit}
			/>
		</div>
	)
}
