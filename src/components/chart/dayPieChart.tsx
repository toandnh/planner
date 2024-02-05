'use client'

import { useEffect, useState } from 'react'

import useSWR from 'swr'

import ChartLayout from './pieChartLayout'

const getFirstHourOfDay = (day: Date) => {
	return new Date(new Date(day).toDateString()).getTime()
}

export default function DayPieChart({
	Chart,
	tabName
}: {
	Chart: React.FunctionComponent<any>
	tabName: string
}) {
	const millisecInDay = 24 * 60 * 60 * 1000

	const [startTime, setStartTime] = useState(getFirstHourOfDay(new Date()))

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR(
		`/api/${tabName}?start-time=${startTime}&end-time=${
			startTime + millisecInDay - 1
		}`,
		fetcher
	)

	const [prevClickDisabled, setPrevClickDisabled] = useState(false)
	const [nextClickDisabled, setNextClickDisabled] = useState(false)
	const [fforwardClickDisabled, setFForwardClickDisabled] = useState(true)

	const handlePrevClick = () => {
		setStartTime(startTime - millisecInDay)
	}

	const handleNextClick = () => {
		setStartTime(startTime + millisecInDay)
	}

	const handleFastForwardClick = () => {
		setStartTime(getFirstHourOfDay(new Date()))
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
				startTime < getFirstHourOfDay(new Date()) ? false : true
			)
		}
	}, [data])

	return (
		<ChartLayout
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
			endTime={new Date(startTime + millisecInDay - 1).toDateString()}
		/>
	)
}
