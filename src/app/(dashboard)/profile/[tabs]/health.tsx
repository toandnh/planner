export default function HealthProfile() {
	return (
		<form className='h-full w-full flex flex-col justify-center gap-10 p-10'>
			<div className='flex justify-center gap-5'>
				<div className='flex gap-5'>
					<div className='grid grid-flow-row gap-5'>
						<label>Gender: </label>
						<label>Height: </label>
						<label>Goal: </label>
						<label>Progress: </label>
					</div>

					<div className='grid grid-flow-row gap-5'>
						<select name='gender'>
							<option value='female'>Female</option>
							<option value='male'>Male</option>
						</select>
						<input type='text' placeholder='1.65m' />
						<select name='options'>
							<option value='lose'>Lose</option>
							<option value='gain'>Gain</option>
						</select>
						<p>Lost</p>
					</div>
				</div>

				<div className='flex gap-5'>
					<div className='grid grid-flow-row gap-5'>
						<p>BMI: </p>
						<label>Weight: </label>
						<label>Amount: </label>
						<label>Amount: </label>
					</div>

					<div className='grid grid-flow-row gap-5'>
						<p>18</p>
						<input type='text' placeholder='55kg' />
						<input type='text' placeholder='5kg' />
						<p>0kg</p>
					</div>
				</div>
			</div>

			<div className='flex justify-center items-center'>
				<input
					className='bg-green-500 p-3 rounded-md hover:bg-green-600 hover:cursor-pointer'
					type='submit'
					value='Save changes'
				/>
			</div>
		</form>
	)
}
