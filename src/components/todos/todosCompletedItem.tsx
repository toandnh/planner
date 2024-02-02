'use client'

import useSWRMutation from 'swr/mutation'

import RestoreIcon from '@mui/icons-material/Restore'

import { useAppSelector } from '@/lib/hooks'

import { showTaskItems } from '@/lib/features/todos/todosSlice'

import TodosTaskPriorityName from './todosTaskPriorityName'

import DeleteButton from '@/buttons/deleteButton'

export default function TodosCompletedItem({
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

	const showItems: boolean =
		useAppSelector(showTaskItems).get(datum.task!) || false

	const hasTaskItems = datum.taskItems.length > 0

	const handleRestoreClick = async (datum: TodoDatum) => {
		await trigger({
			item: datum.item,
			task: datum.task,
			taskItems: datum.taskItems,
			priority: `${datum.priority}`,
			completed: false
		})
	}

	return (
		<>
			<div className='min-h-[35px] flex justify-center items-center'>
				<TodosTaskPriorityName datum={datum} color='bg-neutral-400' />
				<button className='w-1/3' onClick={() => handleRestoreClick(datum)}>
					<RestoreIcon fontSize='medium' />
				</button>
				<div className='w-1/3 flex justify-center items-center'>
					<DeleteButton url={`/api/todos?userId=${userId}`} item={datum.item} />
				</div>
				<div className='w-1/3'>
					<p className='hidden'>HIDDEN</p>
				</div>
				<div className='w-1/3'>
					<p className='hidden'>HIDDEN</p>
				</div>
			</div>
			{showItems &&
				hasTaskItems &&
				datum.taskItems.map((taskItem: (string | boolean)[], i: number) => {
					return (
						<div key={`taskItems#${i}#${datum.task}`} className='flex pl-10'>
							{taskItem[0]}
						</div>
					)
				})}
		</>
	)
}
