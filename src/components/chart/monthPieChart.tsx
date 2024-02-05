'use client'

import { useEffect, useState } from 'react'

import useSWR from 'swr'

import PieChartLayout from './pieChartLayout'

import { getFirstDayOfYear, getLastDayOfYear } from '../utilities/utilities'

export default function MonthPieChart({
	Chart,
	tabName
}: {
	Chart: React.FunctionComponent<any>
	tabName: string
}) {
	const [startTime, setStartTime] = useState(getFirstDayOfYear(new Date()))

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR(
		`/api/${tabName}?start-time=${startTime}&end-time=${getLastDayOfYear(
			new Date(startTime)
		)}`,
		fetcher
	)

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

	return (
		<PieChartLayout
			data={data}
			isLoading={isLoading}
			Chart={Chart}
			handlePrevClick={handlePrevClick}
			handleNextClick={handleNextClick}
			handleFastForwardClick={handleFastForwardClick}
			prevClickDisabled={prevClickDisabled}
			nextClickDisabled={nextClickDisabled}
			fforwardClickDisabled={fforwardClickDisabled}
			startTime={new Date(startTime).toDateString()}
			endTime={new Date(getLastDayOfYear(new Date(startTime))).toDateString()}
		/>
	)
}
