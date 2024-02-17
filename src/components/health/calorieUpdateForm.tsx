'use client'

import { useEffect, useState } from 'react'

import { mutate } from 'swr'

import useSWRMutation from 'swr/mutation'

export default function CalorieUpdateForm({ datum }: { datum: CalorieDatum }) {
	const fetcher = async (url: string, { arg }: { arg: CalorieDatum }) =>
		fetch(url, {
			method: 'PUT',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation('/api/health/calorie', fetcher, {
		revalidate: true
	})

	const [stateChanged, setStateChanged] = useState(false)

	const [activity, setActivity] = useState(datum.activity)
	const [amount, setAmount] = useState(datum.amount)

	useEffect(() => {
		let validAmount = amount.charAt(0) !== '0'

		let activityChanged = activity !== datum.activity
		let amountChanged = validAmount && amount !== datum.amount

		let dataChanged = activityChanged || amountChanged

		// Only enable the button when there is data and the data is not the same as datum prop
		setStateChanged(activity && amount && dataChanged ? true : false)
	}, [datum, activity, amount])

	useEffect(() => {
		// Executes after the data finished loading and;
		// the main reason why this is here - after update was triggered
		// to set the values to the updated ones
		setActivity(datum.activity)
		setAmount(datum.amount)
	}, [datum])

	const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setActivity(e.target.value)
	}

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(e.target.value)
	}

	const handleSubmit = async () => {
		await trigger({
			item: datum.item,
			consumed: datum.consumed,
			activity: activity,
			amount: amount,
			date: datum.date
		})

		// Revalidate all data from 'api/health/calorie...'
		mutate(
			(key) => typeof key === 'string' && key.startsWith('/api/health/calorie')
		)
	}

	return (
		<div className='bg-bone/70 flex flex-col justify-center rounded-md gap-5 p-5'>
			<div className='flex gap-5'>
				<input
					type='text'
					value={activity}
					name='activity'
					onChange={handleActivityChange}
				/>
				<input
					type='text'
					value={amount}
					name='amount'
					onChange={handleAmountChange}
				/>
				<input
					className='bg-green-300 flex items-end justify-center px-2 rounded-md hover:bg-green-400 hover:cursor-pointer hover:disabled:bg-green-200 hover:disabled:cursor-default disabled:bg-green-200'
					type='submit'
					onClick={handleSubmit}
					value='Update'
					disabled={!stateChanged}
				/>
			</div>
		</div>
	)
}
