export default function HealthHome() {
	return (
		<div className='w-full flex flex-col gap-10 p-10'>
			<h2 className='text-xl font-semibold'>Calorie Left: 1000kcal</h2>

			<div>
				<h2 className='text-xl font-semibold'>Calorie In: 800kcal</h2>
				<form className='flex gap-5 pl-5 pt-5'>
					<div>
						<p>Breakfast: </p>
						<p>Lunch: </p>
						<input type='text' placeholder='Add more' />
					</div>
					<div>
						<p>500kcal</p>
						<p>300kcal</p>
						<input type='text' placeholder='10000kcal' />
					</div>
					<div className='flex items-end'>
						<input
							className='bg-green-500 flex items-end px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
							type='submit'
							value='Add'
						/>
					</div>
				</form>
			</div>

			<div>
				<h2 className='text-xl font-semibold'>Calorie Out: 300kcal</h2>
				<form className='flex gap-5 pl-5 pt-5'>
					<div>
						<p>Gym: </p>
						<p>Walking: </p>
						<input type='text' placeholder='Add more' />
					</div>
					<div>
						<p>200kcal</p>
						<p>100kcal</p>
						<input type='text' placeholder='10000kcal' />
					</div>
					<div className='flex items-end'>
						<input
							className='bg-green-500 flex items-end px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
							type='submit'
							value='Add'
						/>
					</div>
				</form>
			</div>
		</div>
	)
}
