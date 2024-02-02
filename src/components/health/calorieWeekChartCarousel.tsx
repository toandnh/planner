'use client'

import { useEffect, useMemo, useState } from 'react'

import useSWR from 'swr'

import CalorieChartItem from './calorieChartItem'

import CalorieWeekChart from './calorieWeekChart'

import { getSunday, getCalorieAverage } from '../utilities/utilities'

export default function CalorieWeekChartCarousel() {
	const millisecInWeek = 7 * 24 * 60 * 60 * 1000

	const [startTime, setStartTime] = useState(getSunday(new Date()))

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR(
		`/api/health/calorie?start-time=${startTime}&end-time=${
			startTime + millisecInWeek
		}`,
		fetcher
	)

	const [prevClickDisabled, setPrevClickDisabled] = useState(false)
	const [nextClickDisabled, setNextClickDisabled] = useState(false)
	const [fforwardClickDisabled, setFForwardClickDisabled] = useState(true)

	const handlePrevClick = () => {
		setStartTime(startTime - millisecInWeek)
	}

	const handleNextClick = () => {
		setStartTime(startTime + millisecInWeek)
	}

	const handleFastForwardClick = () => {
		setStartTime(getSunday(new Date()))
	}

	useEffect(() => {
		if (!isLoading) {
			setPrevClickDisabled(
				startTime < new Date().getTime() && data.message ? true : false
			)
			setNextClickDisabled(
				startTime > new Date().getTime() && data.message ? true : false
			)
			setFForwardClickDisabled(startTime < getSunday(new Date()) ? false : true)
		}
	}, [data])

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

	return (
		<>
			<div className='p-5'>
				{new Date(startTime).toDateString()} -{' '}
				{new Date(startTime + millisecInWeek).toDateString()}
			</div>
			<CalorieChartItem
				data={data}
				CalorieTimeChart={CalorieWeekChart}
				calorieArr={dailyCalorie}
				timeAverage={weekAverage}
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
