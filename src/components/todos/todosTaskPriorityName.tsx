'use client'

import clsx from 'clsx'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import {
	showTaskItems,
	updateShowTaskItems
} from '@/lib/features/todos/todosSlice'

export default function TodosTaskPriorityName({
	datum,
	color
}: {
	datum: TodoDatum
	color: string
}) {
	const showItems: boolean =
		useAppSelector(showTaskItems).get(datum.task!) || false

	const dispatch = useAppDispatch()

	const hasTaskItems: boolean = datum.taskItems.length > 0

	const handleShowMoreClick = () => {
		dispatch(
			updateShowTaskItems({
				taskName: datum.task,
				taskOpened: !showItems
			})
		)
	}

	return (
		<div className='w-full flex'>
			<div className='w-1/3 min-h-[25px] flex justify-start items-center'>
				<span
					key={datum.item}
					className={clsx(
						`${color}`,
						'inline-block h-[20px] aspect-square rounded-full'
					)}
				></span>
			</div>
			<div className='w-full'>
				{!hasTaskItems && <p key={datum.item}>{datum.task}</p>}
				{hasTaskItems && (
					<input
						className='underline hover:text-blue-400 hover:cursor-pointer'
						key={datum.item}
						type='button'
						onClick={handleShowMoreClick}
						value={`${datum.task}`}
					/>
				)}
			</div>
		</div>
	)
}
