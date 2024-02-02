'use client'

import React, { useMemo } from 'react'

import CalorieItem from './calorieItem'
import CalorieAddForm from './calorieAddForm'

export default function CalorieConsumed({
	userId,
	data,
	isLoading
}: {
	userId: string
	data: CalorieDatum[]
	isLoading: boolean
}) {
	const totalCalorie = useMemo(() => {
		let total = 0
		data.map((datum: CalorieDatum) => {
			total += parseInt(datum.amount)
		})
		return total
	}, [data])

	return (
		<div>
			<h3 className='text-xl font-semibold'>
				Calorie Consumed: {totalCalorie} kcal
			</h3>
			<div className='flex flex-col gap-3 pl-5 pt-5 pb-5'>
				{!isLoading &&
					data.map((datum: CalorieDatum) => {
						return (
							<React.Fragment key={datum.item}>
								<CalorieItem userId={userId} datum={datum} />
							</React.Fragment>
						)
					})}
				<CalorieAddForm userId={userId} consumed={true} />
			</div>
		</div>
	)
}
