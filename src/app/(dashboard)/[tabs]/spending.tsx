export default function SpendingHome() {
	return (
		<div className='h-full w-full flex flex-col items-center gap-10 p-10'>
			<div className='flex gap-5'>
				<input
					className='bg-neutral-500 p-2 rounded-md hover:bg-neutral-600 hover:cursor-pointer'
					type='button'
					value='Day'
				/>
				<input
					className='bg-neutral-500 p-2 rounded-md hover:bg-neutral-600 hover:cursor-pointer'
					type='button'
					value='Week'
				/>
				<input
					className='bg-neutral-500 p-2 rounded-md hover:bg-neutral-600 hover:cursor-pointer'
					type='button'
					value='Month'
				/>
				<input
					className='bg-neutral-500 p-2 rounded-md hover:bg-neutral-600 hover:cursor-pointer'
					type='button'
					value='Year'
				/>
			</div>

			<div className='flex gap-5'>
				<div>
					<p>Grocery: </p>
					<p>Book: </p>
					<input type='text' placeholder='Add more' />
				</div>
				<div>
					<p>300CAD</p>
					<p>300CAD</p>
					<input type='text' placeholder='10000CAD' />
				</div>
				<div className='flex items-end'>
					<input
						className='bg-green-500 flex items-end px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
						type='submit'
						value='Add'
					/>
				</div>
			</div>

			<div className='flex gap-5'>
				<div>
					<p>Total Today:</p>
					<p>Total This Month:</p>
				</div>
				<div>
					<p>600CAD</p>
					<p>1600CAD</p>
				</div>
			</div>
		</div>
	)
}
