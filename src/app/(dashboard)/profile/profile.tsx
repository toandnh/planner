'use client'

import { useEffect, useState } from 'react'

import { mutate } from 'swr'

import useSWRMutation from 'swr/mutation'

export default function Profile({ data }: { data: HealthDatum }) {
	const fetcher = async (url: string, { arg }: { arg: HealthDatum }) =>
		fetch(url, {
			method: 'PUT',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation('/api/health', fetcher, {
		revalidate: true
	})

	const [gender, setGender] = useState(data.gender)
	const [height, setHeight] = useState(data.height)
	const [weight, setWeight] = useState(data.weight)
	const [goal, setGoal] = useState(data.goal)
	const [amount, setAmount] = useState(data.amount)

	const [canSave, setCanSave] = useState(false)

	useEffect(() => {
		const genderChange = gender !== data.gender
		const heightChange = height !== data.height && height !== ''
		const weightChange = weight !== data.weight && weight !== ''
		const goalChange = goal !== data.goal
		const amountChange = amount !== data.amount && amount !== ''

		const canUpdate =
			genderChange || heightChange || weightChange || goalChange || amountChange

		setCanSave(canUpdate)
	}, [gender, height, weight, goal, amount])

	const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setGender(e.target.options[e.target.selectedIndex].text)
	}

	const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setHeight(e.target.value)
	}

	const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setWeight(e.target.value)
	}

	const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setGoal(e.target.options[e.target.selectedIndex].text)
	}

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(e.target.value)
	}

	const handleSubmit = async () => {
		await trigger({
			item: 'health',
			gender,
			height,
			weight,
			goal,
			amount
		})

		// Revalidate all data from 'api/health...'
		mutate((key) => typeof key === 'string' && key.startsWith('/api/health'))

		setCanSave(false)
	}

	return (
		<div className='min-h-[60vh] flex flex-col justify-center items-center gap-10 border-2'>
			<div className='flex justify-center gap-5'>
				<div className='flex gap-5'>
					<div className='grid grid-flow-row gap-5'>
						<label>Gender: </label>
						<label>Height: </label>
						<label>Goal: </label>
					</div>

					<div className='grid grid-flow-row gap-5'>
						<select value={gender} onChange={handleGenderChange} name='gender'>
							<option value='female'>Female</option>
							<option value='male'>Male</option>
						</select>
						<input type='text' value={height} onChange={handleHeightChange} />
						<select value={goal} onChange={handleGoalChange} name='options'>
							<option value='lose'>Lose</option>
							<option value='gain'>Gain</option>
						</select>
					</div>
				</div>

				<div className='flex gap-5'>
					<div className='grid grid-flow-row gap-5'>
						<p>BMI: </p>
						<label>Weight: </label>
						<label>Amount: </label>
					</div>

					<div className='grid grid-flow-row gap-5'>
						<p>18</p>
						<input type='text' value={weight} onChange={handleWeightChange} />
						<input type='text' value={amount} onChange={handleAmountChange} />
					</div>
				</div>
			</div>

			<div className='flex justify-center items-center'>
				<input
					className='w-full bg-green-500 flex items-end justify-center p-5 rounded-md hover:bg-green-600 hover:cursor-pointer hover:disabled:bg-green-100 hover:disabled:cursor-default disabled:bg-green-100'
					type='submit'
					value='Save changes'
					onClick={handleSubmit}
					disabled={!canSave}
				/>
			</div>
		</div>
	)
}
