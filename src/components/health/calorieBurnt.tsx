'use client'

import React, { useMemo } from 'react'

import { Flipper, Flipped } from 'react-flip-toolkit'

import CalorieItem from './calorieItem'
import CalorieAddForm from './calorieAddForm'

export default function CalorieBurnt({
	data,
	isLoading
}: {
	data: CalorieDatum[]
	isLoading: boolean
}) {
	const totalCalorie: number = useMemo(() => {
		let total = 0
		data.map((datum) => {
			total += parseInt(datum.amount)
		})
		return total
	}, [data])

	return (
		<div>
			<h3 className='text-xl font-semibold'>
				Calorie Burnt: {totalCalorie} kcal
			</h3>
			<Flipper flipKey={totalCalorie}>
				<div className='flex flex-col gap-3 pl-5 pt-5 pb-5'>
					{!isLoading &&
						data.map((datum) => {
							return (
								<Flipped key={datum.item} flipId={datum.item}>
									<CalorieItem datum={datum} />
								</Flipped>
							)
						})}
					<CalorieAddForm consumed={false} />
				</div>
			</Flipper>
		</div>
	)
}
