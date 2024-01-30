'use client'

import { useEffect, useMemo, useState } from 'react'

import useSWR from 'swr'

import CalorieChartItem from './calorieChartItem'

import CalorieMonthChart from './calorieMonthChart'

import {
	getFirstDayOfMonth,
	getLastDayOfMonth,
	getCalorieArr,
	getAverage
} from '../utilities/utilities'

export default function CalorieMonthChartCarousel({
	userId
}: {
	userId: string
}) {
	const [startTime, setStartTime] = useState(getFirstDayOfMonth(new Date()))
	const [prevClickDisabled, setPrevClickDisabled] = useState(false)
	const [nextClickDisabled, setNextClickDisabled] = useState(false)
	const [fforwardClickDisabled, setFForwardClickDisabled] = useState(true)

	const handlePrevClick = () => {
		const day = new Date(startTime)
		const prevMonth = new Date(
			day.getFullYear(),
			day.getMonth() - 1,
			day.getDate()
		).getTime()
		setStartTime(prevMonth)
	}

	const handleNextClick = () => {
		const day = new Date(startTime)
		const nextMonth = new Date(
			day.getFullYear(),
			day.getMonth() + 1,
			day.getDate()
		).getTime()
		setStartTime(nextMonth)
	}

	const handleFastForwardClick = () => {
		setStartTime(getFirstDayOfMonth(new Date()))
	}

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR(
		`/api/health/calorie?userId=${userId}&start-time=${startTime}&end-time=${getLastDayOfMonth(
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
				startTime < getFirstDayOfMonth(new Date()) ? false : true
			)
		}
	}, [data])

	const monthlyCalorie = useMemo(
		() => getCalorieArr(data, isLoading, 12),
		[data]
	)

	const monthAverage = useMemo(
		() => getAverage(monthlyCalorie, isLoading),
		[monthlyCalorie]
	)

	return (
		<>
			<div className='p-5'>
				{new Date(startTime).toDateString()} -{' '}
				{new Date(getLastDayOfMonth(new Date(startTime))).toDateString()}
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
