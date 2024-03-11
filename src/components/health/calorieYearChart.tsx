'use client'

import { useMemo } from 'react'

import CalorieBarChart from '../chart/calorieBarChart'

import CalorieAverage from './calorieAverage'

import { getCalorieAverage } from '../utilities/utilities'

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

export default function CalorieYearChart({
	data,
	isLoading
}: {
	data: CalorieDatum[]
	isLoading: boolean
}) {
	const monthlyCalorie: number[][] = useMemo(() => {
		// In the form: [[in, out], [in, out], ...]
		let arr: number[][] = Array(12)
			.fill(null)
			.map(() => Array(2).fill(0))

		// Keep the count of days in the month,
		// since there may not always be full month worth of data available
		let dayCount: number[] = Array(12).fill(0)
		let lastDate: number = 0

		if (!isLoading) {
			// Server will send empty object if there is no data
			if (data?.length > 0) {
				for (let datum of data) {
					let date = new Date(parseInt(datum.date))

					// First index represents the month e.g. [Jan = 0, Feb = 1, ...]
					let firstIndex = date.getMonth()
					if (date.getDate() !== lastDate) {
						lastDate = date.getDate()
						dayCount[firstIndex]++
					}

					// Second index represents the whether the item is calorie consumed or burnt e.g. [0 = consumed, 1 = burnt]
					let secondIndex = datum.consumed ? 0 : 1
					arr[firstIndex][secondIndex] += parseInt(datum.amount)
				}
			}
		}

		arr.forEach((entry: number[], i: number) => {
			arr[i] =
				dayCount[i] !== 0
					? [
							Math.round(entry[0] / dayCount[i]),
							Math.round(entry[1] / dayCount[i])
					  ]
					: entry
		})

		return arr
	}, [data])

	const monthAverage: number[] = useMemo(
		() => getCalorieAverage(monthlyCalorie, isLoading),
		[monthlyCalorie]
	)

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
		<div className='flex flex-col justify-center'>
			<CalorieBarChart dataset={dataset} />
			<CalorieAverage average={monthAverage} />
		</div>
	)
}
