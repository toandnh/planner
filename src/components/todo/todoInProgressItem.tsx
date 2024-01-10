import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'

import TaskItemsUpdateForm from '@/components/todo/taskItemsUpdateForm'

import TodoUpdateForm from '@/components/todo/todoUpdateForm'

import TodoTaskPriorityName from './todoTaskPriorityName'

import TodoDeleteButton from '@/components/todo/todoDeleteButton'
import TodoCompleteButton from '@/components/todo/todoCompleteButton'

const priorityMapping = new Map<string, string>([
	['1', 'bg-green-600'],
	['2', 'bg-lime-600'],
	['3', 'bg-yellow-600'],
	['4', 'bg-orange-600'],
	['5', 'bg-red-600']
])

export default function TodoInProgressItem({
	userId,
	datum,
	handleShowEditClick,
	handleShowMoreClick,
	completeness,
	showEdits,
	showItems
}: {
	userId: string
	datum: TodoDatum
	handleShowEditClick: Function
	handleShowMoreClick: Function
	completeness: Map<string, number>
	showEdits: Map<string, boolean>
	showItems: Map<string, boolean>
}) {
	return (
		<>
			{!datum.completed && (
				<>
					<div key={datum.item} className='h-full flex'>
						<TodoTaskPriorityName
							datum={datum}
							handleShowMoreClick={handleShowMoreClick}
							color={priorityMapping.get(datum.priority!)!}
						/>
						<div className='w-full flex flex-row gap-5'>
							<progress
								className='w-2/3 rounded-md'
								max='100'
								value={completeness.get(datum.task!)}
							>
								{`${completeness.get(datum.task!)}%`}
							</progress>
						</div>
						<div className='w-1/3'>
							<button onClick={handleShowEditClick(datum.task!)}>
								{showEdits.get(datum.task!) ? (
									<CloseIcon fontSize='large' />
								) : (
									<EditIcon fontSize='large' />
								)}
							</button>
						</div>
						<div className='w-1/3'>
							<TodoDeleteButton userId={userId} item={datum.item!} />
						</div>
						<div className='w-1/3 flex justify-center items-center'>
							<TodoCompleteButton userId={userId} datum={datum} />
						</div>
					</div>
					{showItems.get(datum.task!) && !showEdits.get(datum.task!) && (
						<TaskItemsUpdateForm userId={userId} datum={datum} />
					)}
					{showEdits.get(datum.task!) && (
						<TodoUpdateForm userId={userId} datum={datum} />
					)}
				</>
			)}
		</>
	)
}
