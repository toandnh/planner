'use client'

import { useMemo } from 'react'

import CalorieBarChart from '../chart/calorieBarChart'

import CalorieAverage from './calorieAverage'

import { getCalorieAverage } from '../utilities/utilities'

const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalorieWeekChart({
	data,
	isLoading
}: {
	data: CalorieDatum[]
	isLoading: boolean
}) {
	const dailyCalorie: number[][] = useMemo(() => {
		// In the form: [[in, out], [in, out], ...]
		let arr: number[][] = Array(7)
			.fill(null)
			.map(() => Array(2).fill(0))

		if (!isLoading) {
			// Server will send empty object if there is no data
			if (data.length > 0) {
				for (let datum of data) {
					let firstIndex = new Date(parseInt(datum.date)).getDay()
					let secondIndex = datum.consumed ? 0 : 1
					arr[firstIndex][secondIndex] += parseInt(datum.amount)
				}
			}
		}

		return arr
	}, [data])

	const weekAverage: number[] = useMemo(
		() => getCalorieAverage(dailyCalorie, isLoading),
		[dailyCalorie]
	)

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
		<div className='flex flex-col justify-center'>
			<CalorieBarChart dataset={dataset} />
			<CalorieAverage average={weekAverage} />
		</div>
	)
}
