'use client'

import { useEffect, useState } from 'react'

import useSWR from 'swr'

import ChartLayout from './chartLayout'

import { getSunday } from '../utilities/utilities'

export default function WeekChart({
	Chart,
	tabName
}: {
	Chart: React.FunctionComponent<any>
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

	return (
		<ChartLayout
			data={data}
			Chart={Chart}
			handlePrevClick={handlePrevClick}
			handleNextClick={handleNextClick}
			handleFastForwardClick={handleFastForwardClick}
			prevClickDisabled={prevClickDisabled}
			nextClickDisabled={nextClickDisabled}
			fforwardClickDisabled={fforwardClickDisabled}
			tabName={tabName}
			startTime={new Date(startTime).toDateString()}
			endTime={new Date(startTime + millisecInWeek).toDateString()}
		/>
	)
}
