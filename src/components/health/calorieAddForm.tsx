'use client'

import { useEffect, useState } from 'react'

import { mutate } from 'swr'

import useSWRMutation from 'swr/mutation'

import { isNumeric } from '../utilities/utilities'

export default function CalorieAddForm({ consumed }: { consumed: boolean }) {
	const fetcher = async (url: string, { arg }: { arg: CalorieDatum }) =>
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation('/api/health/calorie', fetcher, {
		revalidate: true
	})

	const [activity, setActivity] = useState('')
	const [amount, setAmount] = useState('')

	const [canAdd, setCanAdd] = useState(false)

	useEffect(() => {
		setCanAdd(activity !== '' && amount !== '' && isNumeric(amount))
	}, [activity, amount])

	const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setActivity(e.target.value)
	}

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(e.target.value)
	}

	const handleSubmit = async () => {
		await trigger({
			item: `health#calorie#${new Date().getTime()}`,
			activity: activity,
			consumed: consumed,
			amount: amount,
			date: new Date().getTime().toString()
		})

		// Revalidate all data from 'api/health/calorie...'
		mutate(
			(key) => typeof key === 'string' && key.startsWith('/api/health/calorie')
		)

		// Reset values
		setActivity('')
		setAmount('')
	}

	return (
		<div className='w-full flex gap-5'>
			<input
				className='w-1/3'
				type='text'
				value={activity}
				onChange={handleActivityChange}
				placeholder='Something'
			/>
			<input
				className='w-1/3'
				type='text'
				value={amount}
				onChange={handleAmountChange}
				placeholder='10000'
			/>
			<input
				className='w-1/3 bg-green-300 flex items-end justify-center px-2 rounded-md hover:bg-green-400 hover:cursor-pointer hover:disabled:bg-green-200 hover:disabled:cursor-default disabled:bg-green-200'
				type='button'
				onClick={handleSubmit}
				value='Add'
				disabled={!canAdd}
			/>
		</div>
	)
}
