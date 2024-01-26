'use client'

import useSWRMutation from 'swr/mutation'

import RestoreIcon from '@mui/icons-material/Restore'

import { useAppSelector } from '@/lib/hooks'

import { showTaskItems } from '@/lib/features/todos/todosSlice'

import TodosTaskPriorityName from './todosTaskPriorityName'

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

	const showItems = useAppSelector(showTaskItems)

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
			<div className='min-h-[35px] flex'>
				<TodosTaskPriorityName datum={datum} color='bg-neutral-400' />
				<button onClick={() => handleRestoreClick(datum)}>
					<RestoreIcon fontSize='large' />
				</button>
				<div className='w-1/3'>
					<p className='hidden'>HIDDEN</p>
				</div>
				<div className='w-1/3'>
					<p className='hidden'>HIDDEN</p>
				</div>
				<div className='w-1/3'>
					<p className='hidden'>HIDDEN</p>
				</div>
			</div>
			{showItems.get(datum.task!) &&
				datum.taskItems &&
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
