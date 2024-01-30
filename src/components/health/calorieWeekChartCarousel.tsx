'use client'

import { useEffect, useMemo, useState } from 'react'

import useSWR from 'swr'

import CalorieChartItem from './calorieChartItem'

import CalorieWeekChart from './calorieWeekChart'

import { getSunday, getCalorieArr, getAverage } from '../utilities/utilities'

export default function CalorieWeekChartCarousel({
	userId
}: {
	userId: string
}) {
	const millisecInWeek = 7 * 24 * 60 * 60 * 1000

	const [startTime, setStartTime] = useState(getSunday(new Date()))
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

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR(
		`/api/health/calorie?userId=${userId}&start-time=${startTime}&end-time=${
			startTime + millisecInWeek
		}`,
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
			setFForwardClickDisabled(startTime < getSunday(new Date()) ? false : true)
		}
	}, [data])

	const dailyCalorie: number[][] = useMemo(
		() => getCalorieArr(data, isLoading, 7),
		[data]
	)

	const weekAverage: number[] = useMemo(
		() => getAverage(dailyCalorie, isLoading),
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
