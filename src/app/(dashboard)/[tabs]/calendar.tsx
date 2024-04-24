'use client'

import { useCallback, useMemo, useState } from 'react'

import useSWR from 'swr'

import {
	Calendar as ReactBigCalendar,
	momentLocalizer,
	type View
} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import moment from 'moment'

import CircularProgress from '@mui/material/CircularProgress'

import CalendarAddForm from '@/components/calendar/calendarAddForm'
import CalendarUpdateForm from '@/components/calendar/calendarUpdateForm'

import Modal from '@/components/modal/modal'

import {
	getFirstDayOfMonth,
	getLastDayOfMonth
} from '@/components/utilities/utilities'

import { useToggle } from '@/hooks/hooks'

const localizer = momentLocalizer(moment)

export default function Calendar() {
	let startTime = getFirstDayOfMonth(new Date())
	let endTime = getLastDayOfMonth(new Date())

	const fetcher = ([url]: (string | number)[]) =>
		fetch(
			(url as string) +
				'?' +
				new URLSearchParams({
					'start-time': startTime.toString(),
					'end-time': endTime.toString()
				})
		).then((res) => res.json())
	const { isLoading, data, mutate } = useSWR(
		['/api/calendar', startTime, endTime],
		fetcher,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false
		}
	)

	const [eventPeriod, setEventPeriod] = useState(data)
	const [currEvent, setCurrEvent] = useState({
		item: '',
		title: '',
		start: new Date(),
		end: new Date(),
		allDay: false
	})
	const [addEvent, setAddEvent] = useState(true)
	const [modalOpened, toggleModal] = useToggle(false)

	const max = useMemo(() => new Date(new Date().getFullYear() + 10, 11, 0), [])

	const events: EventType[] = useMemo(() => {
		const eventArr: EventType[] = new Array<EventType>()
		if (!isLoading) {
			if (data?.length > 0) {
				data.map((datum: CalendarDatum) => {
					eventArr.push({
						item: datum.item,
						title: datum.event,
						start: new Date(parseInt(datum.start)),
						end: new Date(parseInt(datum.end)),
						allDay: datum.allDay
					})
				})
			}
		}
		return eventArr
	}, [data])

	const handleSelectSlot = useCallback(
		({ start, end }: { start: Date; end: Date }) => {
			setAddEvent(true)
			setEventPeriod({
				start: start.getTime().toString(),
				end: end.getTime().toString()
			})
			toggleModal()
		},
		[setEventPeriod]
	)

	const handleSelectEvent = useCallback(
		(event: EventType) => {
			setAddEvent(false)
			setCurrEvent(event)
			toggleModal()
		},
		[toggleModal]
	)

	const handleNavigate = (date: Date, view: View) => {
		startTime = getFirstDayOfMonth(date)
		endTime = getLastDayOfMonth(date)

		// Revalidate all data from 'api/calendar'
		mutate(
			(key: any) => typeof key === 'string' && key.startsWith('/api/calendar')
		)
	}

	return (
		<div className='w-full h-screen min-h-[600px] p-2 md:p-5 lg:p-10'>
			{isLoading && (
				<div className='w-full h-[50vh] flex justify-center items-center'>
					<CircularProgress />
				</div>
			)}
			{!isLoading && (
				<>
					<ReactBigCalendar
						localizer={localizer}
						events={events}
						max={max}
						startAccessor='start'
						endAccessor='end'
						selectable
						onSelectSlot={handleSelectSlot}
						onSelectEvent={handleSelectEvent}
						onNavigate={handleNavigate}
					/>
					{modalOpened && (
						<Modal toggleModal={toggleModal}>
							{addEvent && (
								<CalendarAddForm
									eventPeriod={eventPeriod}
									toggleModal={toggleModal}
								/>
							)}
							{!addEvent && (
								<CalendarUpdateForm
									calendarEvent={currEvent}
									toggleModal={toggleModal}
								/>
							)}
						</Modal>
					)}
				</>
			)}
		</div>
	)
}
