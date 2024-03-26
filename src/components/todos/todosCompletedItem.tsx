'use client'

import useSWRMutation from 'swr/mutation'

import RestoreIcon from '@mui/icons-material/Restore'

import clsx from 'clsx'

import { useAppSelector } from '@/lib/hooks'

import { useMountTransition } from '@/hooks/hooks'

import { showTaskItems } from '@/lib/features/todos/todosSlice'

import TodosTaskPriorityName from './todosTaskPriorityName'

import DeleteButton from '@/components/buttons/deleteButton'

import { useMediaQuery } from '@/hooks/hooks'

export default function TodosCompletedItem({ datum }: { datum: TodoDatum }) {
	const fetcher = async (url: string, { arg }: { arg: TodoDatum }) =>
		fetch(url, {
			method: 'PUT',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation('/api/todos', fetcher, {
		revalidate: true
	})

	const showItems: boolean =
		useAppSelector(showTaskItems).get(datum.task!) || false

	const hasTaskItems: boolean = datum.taskItems.length > 0

	const hasTransitionedIn = useMountTransition(showItems, 150)

	const isBreakPoint = useMediaQuery(601)

	const handleRestoreClick = async () => {
		await trigger({
			item: datum.item,
			task: datum.task,
			taskItems: datum.taskItems,
			priority: `${datum.priority}`,
			completed: false
		})
	}

	let content = (
		<div className='flex flex-col gap-3 pt-3'>
			{datum.taskItems.map((taskItem: (string | boolean)[], i: number) => {
				return (
					<div
						key={`taskItems#${i}#${datum.task}`}
						className={clsx(
							'pl-10 rounded-md',
							i % 2 == 0 ? 'bg-stone-500/70' : 'bg-neutral-500/70'
						)}
					>
						{taskItem[0]}
					</div>
				)
			})}
		</div>
	)

	return (
		<div>
			<div
				className={clsx(
					'h-full min-h-[35px] flex justify-center items-center z-10',
					isBreakPoint ? 'flex-col gap-5' : ''
				)}
			>
				<TodosTaskPriorityName datum={datum} color='bg-neutral-400' />
				<div className={clsx('w-2/3 flex', isBreakPoint ? 'justify-end' : '')}>
					<button className='w-1/3' onClick={handleRestoreClick}>
						<RestoreIcon fontSize='medium' />
					</button>
					<div className='w-1/3 flex justify-center items-center'>
						<DeleteButton url={'/api/todos'} item={datum.item} />
					</div>
					{!isBreakPoint && (
						<>
							<div className='w-1/3'>
								<p className='hidden'>HIDDEN</p>
							</div>
							<div className='w-1/3'>
								<p className='hidden'>HIDDEN</p>
							</div>
						</>
					)}
				</div>
			</div>

			{(hasTransitionedIn || (showItems && hasTaskItems)) && (
				<div
					className={`${
						hasTransitionedIn && showItems && hasTaskItems
							? 'opacity-100 translate-y-0 transition-{opactity} duration-200 ease-in transition-{transform} duration-200 ease-in'
							: 'opacity-0 -translate-y-6 transition-{opactity} duration-150 ease-out transition-{transform} duration-150 ease-out'
					}`}
				>
					{content}
				</div>
			)}
		</div>
	)
}
