'use client'

import { useEffect, useState } from 'react'

import { mutate } from 'swr'

import useSWRMutation from 'swr/mutation'

export default function SpendingAddForm() {
	const fetcher = async (url: string, { arg }: { arg: SpendingDatum }) =>
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation('/api/spending', fetcher, {
		revalidate: true
	})

	const [spending, setSpending] = useState('')
	const [amount, setAmount] = useState('')
	const [category, setCategory] = useState('')

	const [canAdd, setCanAdd] = useState(false)

	useEffect(() => {
		setCanAdd(spending !== '' && amount !== '')
	}, [spending, amount])

	const handleSpendingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSpending(e.target.value)
	}

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(e.target.value)
	}

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCategory(e.target.options[e.target.selectedIndex].text)
	}

	const handleSubmit = async () => {
		await trigger({
			item: `spending#${new Date().getTime()}`,
			spending: spending,
			amount: amount,
			category: category,
			date: new Date().getTime().toString()
		})

		// Revalidate all data from 'api/health/calorie...'
		mutate((key) => typeof key === 'string' && key.startsWith('/api/spending'))

		// Reset values
		setSpending('')
		setAmount('')
		setCategory('Others')
	}

	return (
		<div className='flex gap-5'>
			<div className='w-3/4 flex gap-5'>
				<input
					className='w-1/3'
					type='text'
					value={spending}
					onChange={handleSpendingChange}
					placeholder='Add more'
				/>
				<input
					className='w-1/3'
					type='text'
					value={amount}
					onChange={handleAmountChange}
					placeholder='10000CAD'
				/>
				<div className='w-1/3'>
					<select
						className='w-full'
						value={category}
						onChange={handleCategoryChange}
						name='category'
					>
						<option value='Others'>Others</option>
						<option value='Education'>Education</option>
						<option value='Emergency'>Emergency</option>
						<option value='Entertainment'>Entertainment</option>
						<option value='Bills'>Bills</option>
						<option value='Health'>Health</option>
						<option value='Hobby'>Hobby</option>
						<option value='Grocery'>Grocery</option>
					</select>
				</div>
			</div>
			<input
				className='w-1/6 bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer hover:disabled:bg-green-100 hover:disabled:cursor-default disabled:bg-green-100'
				type='submit'
				onClick={handleSubmit}
				value='Add'
				disabled={!canAdd}
			/>
		</div>
	)
}
