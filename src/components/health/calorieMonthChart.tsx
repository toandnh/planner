'use client'

import { useMemo } from 'react'

import CalorieBarChart from '../chart/calorieBarChart'

const month = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
]

export default function CalorieMonthChart({
	data,
	calorieArr: monthlyCalorie
}: {
	data: CalorieDatum[]
	calorieArr: number[][]
}) {
	const dataset: CalorieChartData[] = useMemo(() => {
		let set: CalorieChartData[] = []
		monthlyCalorie.map((datum, i) => {
			let currObj = {
				consumed: datum[0],
				burnt: datum[1],
				time: month[i]
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
