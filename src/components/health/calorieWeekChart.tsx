'use client'

import { useMemo } from 'react'

import CalorieBarChart from '../chart/calorieBarChart'

const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalorieWeekChart({
	data,
	calorieArr: dailyCalorie
}: {
	data: CalorieDatum[]
	calorieArr: number[][]
}) {
	const dataset: CalorieChartData[] = useMemo(() => {
		let set: CalorieChartData[] = []
		dailyCalorie.map((datum, i) => {
			let currObj = {
				consumed: datum[0],
				burnt: datum[1],
				time: day[i]
			}
			set.push(currObj)
		})
		return set
	}, [data])

	return (
		<div className='flex justify-center'>
			<CalorieBarChart dataset={dataset} />
		</div>
	)
}
