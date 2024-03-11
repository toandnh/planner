'use client'

import { useEffect, useState } from 'react'

import { mutate } from 'swr'

import useSWRMutation from 'swr/mutation'

import { isNumeric } from '../utilities/utilities'

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
		setCanAdd(spending !== '' && amount !== '' && isNumeric(amount))
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

		// Revalidate all data from 'api/spending...'
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
					placeholder='10000'
				/>
				<div className='w-1/3'>
					<select
						className='w-full'
						value={category}
						onChange={handleCategoryChange}
						name='category'
					>
						<option value='Others'>Others</option>
						<option value='Bills'>Bills</option>
						<option value='Education'>Education</option>
						<option value='Emergency'>Emergency</option>
						<option value='Entertainment'>Entertainment</option>
						<option value='Grocery'>Grocery</option>
						<option value='Health'>Health</option>
						<option value='Hobby'>Hobby</option>
						<option value='Grocery'>Investing</option>
					</select>
				</div>
			</div>
			<input
				className='w-1/6 bg-green-300 flex items-end justify-center px-2 rounded-md hover:bg-green-400 hover:cursor-pointer hover:disabled:bg-green-200 hover:disabled:cursor-default disabled:bg-green-200'
				type='submit'
				onClick={handleSubmit}
				value='Add'
				disabled={!canAdd}
			/>
		</div>
	)
}
