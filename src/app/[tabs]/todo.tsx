import { useState } from 'react'

import clsx from 'clsx'

export default function Todo() {
	const [isEdit, setIsEdit] = useState(false)
	const [itemIndex, setItemIndex] = useState<string | null>(null)

	const handleEditClick = (e: React.MouseEvent<HTMLInputElement>) => {
		e.preventDefault()
		setIsEdit(true)
		setItemIndex((e as any).target.value)
	}

	return (
		<div className='h-full w-full flex flex-col items-center gap-10 p-10'>
			<h2 className='text-xl font-semibold'>To-do List</h2>

			<input
				className='h-1/4 w-full rounded-md'
				type='text'
				placeholder='Search...'
			/>

			<div className='h-full w-full'>
				<h3 className='justify-start text-xl font-semibold'>In Progress</h3>
				<form className='flex justify-center gap-24 pl-5 pt-5'>
					<div className='flex flex-col gap-10'>
						<p className='font-semibold'>Task</p>
						<p>EECS4411 Assignment: </p>
						<p>ESL1450 Essay: </p>
						<p>Grocery Shopping: </p>
						<input type='text' placeholder='Add more' />
					</div>

					<div className='flex flex-col gap-10'>
						<p className='font-semibold'>Priority</p>
						<span className='bg-red-600 h-full'></span>
						<span className='bg-orange-600 h-full'></span>
						<span className='bg-green-600 h-full'></span>
						<select name='priority'>
							<option value='veryHigh'>Very High</option>
							<option value='high'>High</option>
							<option value='moderate'>Moderate</option>
							<option value='low'>Low</option>
							<option value='veryLow'>Very Low</option>
						</select>
					</div>

					<div className='flex flex-col justify-center text-justify gap-10'>
						<input
							className='bg-orange-500 flex items-end justify-center px-2 rounded-md hover:bg-orange-600 hover:cursor-pointer'
							id='1'
							type='button'
							onClick={handleEditClick}
							value='Edit'
						/>
						<input
							className='bg-orange-500 flex items-end justify-center px-2 rounded-md hover:bg-orange-600 hover:cursor-pointer'
							type='button'
							value='Edit'
						/>
						<input
							className='bg-orange-500 flex items-end justify-center px-2 rounded-md hover:bg-orange-600 hover:cursor-pointer'
							type='button'
							value='Edit'
						/>
					</div>

					<div className='flex flex-col justify-end text-justify gap-10'>
						<input
							className='bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
							type='button'
							value='Done'
						/>
						<input
							className='bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
							type='button'
							value='Done'
						/>
						<input
							className='bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
							type='button'
							value='Done'
						/>
						<input
							className='bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
							type='submit'
							value='Add'
						/>
					</div>
				</form>
			</div>

			<div className='h-full w-full'>
				<h3 className='justify-start text-xl font-semibold pb-5'>Completed</h3>
				<div className='flex flex-col gap-3 pl-5'>
					<p>Rest</p>
					<p>Play games</p>
					<p>Surfing the net</p>
				</div>
			</div>
		</div>
	)
}
