'use client'

import { useEffect, useState } from 'react'

import { mutate } from 'swr'

import useSWRMutation from 'swr/mutation'

export default function SpendingUpdateForm({
	datum
}: {
	datum: SpendingDatum
}) {
	const fetcher = async (url: string, { arg }: { arg: SpendingDatum }) =>
		fetch(url, {
			method: 'PUT',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation('/api/spending', fetcher, {
		revalidate: true
	})

	const [stateChanged, setStateChanged] = useState(false)

	const [spending, setSpending] = useState(datum.spending)
	const [amount, setAmount] = useState(datum.amount)
	const [category, setCategory] = useState(datum.category)

	useEffect(() => {
		let validAmount = amount.charAt(0) !== '0'

		let spendingChanged = spending !== datum.spending
		let amountChanged = validAmount && amount !== datum.amount

		let dataChanged = spendingChanged || amountChanged

		// Only enable the button when there is data and the data is not the same as datum prop
		setStateChanged(spending && amount && dataChanged ? true : false)
	}, [datum, spending, amount])

	useEffect(() => {
		// Executes after the data finished loading and;
		// the main reason why this is here - after update was triggered
		// to set the values to the updated ones
		setSpending(datum.spending)
		setAmount(datum.amount)
		setCategory(datum.category)
	}, [datum])

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
			item: datum.item,
			spending: spending,
			amount: amount,
			category: category,
			date: datum.date
		})

		// Revalidate all data from 'api/spending...'
		mutate((key) => typeof key === 'string' && key.startsWith('/api/spending'))
	}

	return (
		<div className='bg-gray-400 flex flex-col justify-center gap-5 p-5'>
			<div className='flex gap-5'>
				<input
					className='w-3/4'
					type='text'
					value={spending}
					name='spending'
					onChange={handleSpendingChange}
				/>
				<input
					className='w-3/4'
					type='text'
					value={amount}
					name='amount'
					onChange={handleAmountChange}
				/>
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
				<input
					className='bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer hover:disabled:bg-green-100 hover:disabled:cursor-default disabled:bg-green-100'
					type='submit'
					onClick={handleSubmit}
					value='Update'
					disabled={!stateChanged}
				/>
			</div>
		</div>
	)
}
