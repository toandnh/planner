'use client'

import React, { useMemo } from 'react'

import CalorieItem from './calorieItem'
import CalorieAddForm from './calorieAddForm'

export default function CalorieBurnt({
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
		data.map((datum) => {
			total += parseInt(datum.amount)
		})
		return total
	}, [data])

	return (
		<div>
			<h2 className='text-xl font-semibold'>
				Calorie Burnt: {totalCalorie}kcal
			</h2>
			<div className='flex flex-col gap-3 pl-5 pt-5 pb-5'>
				{!isLoading &&
					data.map((datum) => {
						return (
							<React.Fragment key={datum.item}>
								<CalorieItem datum={datum} />
							</React.Fragment>
						)
					})}
				<CalorieAddForm userId={userId} consumed={false} />
			</div>
		</div>
	)
}
