'use client'

import { useEffect, useMemo, useState } from 'react'

import useSWR from 'swr'

import CalorieChartItem from './calorieChartItem'

import CalorieMonthChart from './calorieMonthChart'

import {
	getFirstDayOfYear,
	getLastDayOfYear,
	getAverage
} from '../utilities/utilities'

export default function CalorieMonthChartCarousel({
	userId
}: {
	userId: string
}) {
	const [startTime, setStartTime] = useState(getFirstDayOfYear(new Date()))
	const [prevClickDisabled, setPrevClickDisabled] = useState(false)
	const [nextClickDisabled, setNextClickDisabled] = useState(false)
	const [fforwardClickDisabled, setFForwardClickDisabled] = useState(true)

	const handlePrevClick = () => {
		const day = new Date(startTime)
		const prevYear = new Date(
			day.getFullYear() - 1,
			day.getMonth(),
			day.getDate()
		).getTime()
		setStartTime(prevYear)
	}

	const handleNextClick = () => {
		const day = new Date(startTime)
		const nextYear = new Date(
			day.getFullYear() + 1,
			day.getMonth(),
			day.getDate()
		).getTime()
		setStartTime(nextYear)
	}

	const handleFastForwardClick = () => {
		setStartTime(getFirstDayOfYear(new Date()))
	}

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR(
		`/api/health/calorie?userId=${userId}&start-time=${startTime}&end-time=${getLastDayOfYear(
			new Date(startTime)
		)}`,
		fetcher
	)

	useEffect(() => {
		if (!isLoading) {
			setPrevClickDisabled(
				startTime < new Date().getTime() && data.message ? true : false
			)
			setNextClickDisabled(
				startTime > new Date().getTime() && data.message ? true : false
			)
			setFForwardClickDisabled(
				startTime < getFirstDayOfYear(new Date()) ? false : true
			)
		}
	}, [data])

	const monthlyCalorie = useMemo(() => {
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
			if (data.length > 0) {
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

	const monthAverage = useMemo(
		() => getAverage(monthlyCalorie, isLoading),
		[monthlyCalorie]
	)

	return (
		<>
			<div className='p-5'>
				{new Date(startTime).toDateString()} -{' '}
				{new Date(getLastDayOfYear(new Date(startTime))).toDateString()}
			</div>
			<CalorieChartItem
				data={data}
				CalorieTimeChart={CalorieMonthChart}
				calorieArr={monthlyCalorie}
				timeAverage={monthAverage}
				handlePrevClick={handlePrevClick}
				handleNextClick={handleNextClick}
				handleFastForwardClick={handleFastForwardClick}
				prevClickDisabled={prevClickDisabled}
				nextClickDisabled={nextClickDisabled}
				fforwardClickDisabled={fforwardClickDisabled}
			/>
		</>
	)
}
