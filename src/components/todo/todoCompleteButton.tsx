'use client'

import useSWRMutation from 'swr/mutation'

export default function TodoCompleteButton({
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

	const handleComplete =
		(item: string) => async (e: React.MouseEvent<HTMLInputElement>) => {
			await trigger({
				item: datum.item,
				task: datum.task,
				taskItems: datum.taskItems,
				priority: `${datum.priority}`,
				completed: true
			})
		}

	return (
		<>
			<input
				className='bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
				key={datum.item}
				type='button'
				onClick={handleComplete(datum.item!)}
				value='Done'
			/>
		</>
	)
}
