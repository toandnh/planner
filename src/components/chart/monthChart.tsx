'use client'

import { useCallback, useEffect, useState } from 'react'

import useSWR from 'swr'

import ChartLayout from './chartLayout'

import { getFirstDayOfMonth, getLastDayOfMonth } from '../utilities/utilities'

export default function MonthPieChart({
	Chart,
	tabName
}: {
	Chart: React.FunctionComponent<any>
	tabName: string
}) {
	const [startTime, setStartTime] = useState(getFirstDayOfMonth(new Date()))

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR(
		`/api/${tabName}?start-time=${startTime}&end-time=${getLastDayOfMonth(
			new Date(startTime)
		)}`,
		fetcher
	)

	const [prevClickDisabled, setPrevClickDisabled] = useState(false)
	const [nextClickDisabled, setNextClickDisabled] = useState(false)
	const [fforwardClickDisabled, setFForwardClickDisabled] = useState(true)

	const handlePrevClick = useCallback(() => {
		const day = new Date(startTime)
		const prevMonth = new Date(
			day.getFullYear(),
			day.getMonth() - 1,
			day.getDate()
		).getTime()
		setStartTime(prevMonth)
	}, [startTime, setStartTime])

	const handleNextClick = useCallback(() => {
		const day = new Date(startTime)
		const nextMonth = new Date(
			day.getFullYear(),
			day.getMonth() + 1,
			day.getDate()
		).getTime()
		setStartTime(nextMonth)
	}, [startTime, setStartTime])

	const handleFastForwardClick = useCallback(() => {
		setStartTime(getFirstDayOfMonth(new Date()))
	}, [startTime, setStartTime])

	useEffect(() => {
		if (!isLoading) {
			setPrevClickDisabled(data.hasFirstItem || false)
			setNextClickDisabled(
				startTime < getFirstDayOfMonth(new Date()) ? false : true
			)
			setFForwardClickDisabled(
				startTime < getFirstDayOfMonth(new Date()) ? false : true
			)
		}
	}, [data])

	return (
		<ChartLayout
			data={data?.results}
			isLoading={isLoading}
			Chart={Chart}
			handlePrevClick={handlePrevClick}
			handleNextClick={handleNextClick}
			handleFastForwardClick={handleFastForwardClick}
			prevClickDisabled={prevClickDisabled}
			nextClickDisabled={nextClickDisabled}
			fforwardClickDisabled={fforwardClickDisabled}
			startTime={new Date(startTime).toDateString()}
			endTime={new Date(getLastDayOfMonth(new Date(startTime))).toDateString()}
		/>
	)
}
