'use client'

import { useEffect, useState } from 'react'

import useSWRMutation from 'swr/mutation'

export default function CalorieAddForm({
	userId,
	consumed
}: {
	userId: string
	consumed: boolean
}) {
	const fetcher = async (url: string, { arg }: { arg: CalorieDatum }) =>
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation(
		`/api/health/calorie?userId=${userId}`,
		fetcher,
		{
			revalidate: true
		}
	)

	const [activity, setActivity] = useState('')
	const [amount, setAmount] = useState('')

	const [canAdd, setCanAdd] = useState(false)

	useEffect(() => {
		setCanAdd(activity !== '' && amount !== '')
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
			amount: amount
		})
	}

	return (
		<div className='flex gap-5'>
			<input
				type='text'
				value={activity}
				onChange={handleActivityChange}
				placeholder='Something'
			/>
			<input
				type='text'
				value={amount}
				onChange={handleAmountChange}
				placeholder='10000kcal'
			/>
			<input
				className='w-1/3 bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer hover:disabled:bg-green-100 hover:disabled:cursor-default disabled:bg-green-100'
				type='button'
				onClick={handleSubmit}
				value='Add'
				disabled={!canAdd}
			/>
		</div>
	)
}
