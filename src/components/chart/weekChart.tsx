'use client'

import { useCallback, useEffect, useState } from 'react'

import useSWR from 'swr'

import ChartLayout from './chartLayout'

import { getSunday } from '../utilities/utilities'

export default function WeekChart({
	Chart,
	tabName
}: {
	Chart: React.FunctionComponent<{ data: any[]; isLoading: boolean }>
	tabName: string
}) {
	const millisecInWeek = 7 * 24 * 60 * 60 * 1000

	const [startTime, setStartTime] = useState(getSunday(new Date()))

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR(
		`/api/${tabName}?start-time=${startTime}&end-time=${
			startTime + millisecInWeek
		}`,
		fetcher
	)

	const [prevClickDisabled, setPrevClickDisabled] = useState(false)
	const [nextClickDisabled, setNextClickDisabled] = useState(false)
	const [fforwardClickDisabled, setFForwardClickDisabled] = useState(true)

	const handlePrevClick = useCallback(() => {
		setStartTime(startTime - millisecInWeek)
	}, [startTime, setStartTime])

	const handleNextClick = useCallback(() => {
		setStartTime(startTime + millisecInWeek)
	}, [startTime, setStartTime])

	const handleFastForwardClick = useCallback(() => {
		setStartTime(getSunday(new Date()))
	}, [startTime, setStartTime])

	useEffect(() => {
		if (!isLoading) {
			setPrevClickDisabled(data.hasFirstItem || false)
			setNextClickDisabled(data.hasLastItem || false)
			setFForwardClickDisabled(startTime < getSunday(new Date()) ? false : true)
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
			endTime={new Date(startTime + millisecInWeek).toDateString()}
		/>
	)
}
