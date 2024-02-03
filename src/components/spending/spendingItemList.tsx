import React from 'react'

import SpendingAddForm from './spendingAddForm'
import SpendingItem from './spendingItem'

export default function SpendingItemList({ data }: { data: SpendingDatum[] }) {
	return (
		<>
			<h2 className='text-xl font-semibold'>Today Spending</h2>
			<div className='w-3/4 flex gap-5'>
				<h3 className='w-1/3 font-semibold'>Spending</h3>
				<h3 className='w-1/3 font-semibold'>Amount</h3>
				<h3 className='w-1/3 font-semibold'>Category</h3>
			</div>
			<div className='flex flex-col gap-5'>
				{data.map((datum: SpendingDatum) => (
					<React.Fragment key={datum.item}>
						<SpendingItem datum={datum} />
					</React.Fragment>
				))}
				<SpendingAddForm />
			</div>
		</>
	)
}
