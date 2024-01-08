export default function TodoForm({
	datum,
	handleSubmit,
	handleTaskChange,
	handleTaskPriorityChange,
	handleAddMoreItems,
	handleTaskItemChange,
	stateChanged
}: {
	datum: { task: string; priority: number; taskItems: string[] }
	handleSubmit: React.MouseEventHandler<HTMLInputElement>
	handleTaskChange: React.ChangeEventHandler<HTMLInputElement>
	handleTaskPriorityChange: React.ChangeEventHandler<HTMLSelectElement>
	handleAddMoreItems: React.MouseEventHandler<HTMLInputElement>
	handleTaskItemChange: Function
	stateChanged: boolean
}) {
	return (
		<>
			<div className='flex flex-col gap-5'>
				<div className='flex'>
					<div className='w-full'>
						<input
							type='text'
							value={datum.task}
							name='taskName'
							onChange={handleTaskChange}
							placeholder='Other tasks'
						/>
					</div>
					<div className='w-full'>
						<select
							className='w-1/2'
							value={datum.priority}
							onChange={handleTaskPriorityChange}
							name='priority'
						>
							<option value='5'>Very High</option>
							<option value='4'>High</option>
							<option value='3'>Moderate</option>
							<option value='2'>Low</option>
							<option value='1'>Very Low</option>
						</select>
					</div>
					<div className='w-1/2'>
						<input
							className='bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer hover:disabled:bg-green-100 hover:disabled:cursor-default disabled:bg-green-100'
							type='submit'
							onClick={handleSubmit}
							value='Update'
							disabled={!stateChanged}
						/>
					</div>
				</div>
				{datum.taskItems &&
					datum.taskItems.map((item, i) => {
						return (
							<div key={`row#${i}`} className='pl-20'>
								<input
									type='text'
									value={item[0] as string}
									name={`taskItems${i}`}
									onChange={handleTaskItemChange(i)}
									placeholder='List item'
								/>
							</div>
						)
					})}
				<div className='w-full flex justify-center'>
					<input
						className='bg-green-300 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
						type='submit'
						onClick={handleAddMoreItems}
						value='Add more items'
					/>
				</div>
			</div>
		</>
	)
}
