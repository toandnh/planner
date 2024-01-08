import clsx from 'clsx'

export default function TodoTaskPriorityName({
	datum,
	handleShowMoreClick,
	color
}: {
	datum: TodoDatum
	handleShowMoreClick: Function
	color: string
}) {
	return (
		<>
			<div className='w-1/3'>
				<span
					key={datum.item}
					className={clsx(
						`${color}`,
						'inline-block h-2/3 aspect-square rounded-full'
					)}
				></span>
			</div>
			<div className='w-full'>
				{!datum.taskItems && <p key={datum.item}>{datum.task}</p>}
				{datum.taskItems && (
					<input
						className='underline hover:text-blue-400 hover:cursor-pointer'
						key={datum.item}
						type='button'
						onClick={handleShowMoreClick(datum.task!)}
						value={`${datum.task}`}
					/>
				)}
			</div>
		</>
	)
}
