'use client'

import useSWRMutation from 'swr/mutation'

import DoneAllIcon from '@mui/icons-material/DoneAll'

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

	const handleComplete = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
			<button onClick={handleComplete}>
				<DoneAllIcon fontSize='large' />
			</button>
		</>
	)
}
