'use client'

import { useMemo } from 'react'

import useSWRMutation from 'swr/mutation'

import CalendarForm from './calendarForm'

export default function CalendarUpdateForm({
	calendarEvent,
	toggleModal
}: {
	calendarEvent: EventType
	toggleModal: Function
}) {
	const fetcher = async (url: string, { arg }: { arg: CalendarDatum }) =>
		fetch(url, {
			method: 'PUT',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation('/api/calendar', fetcher, {
		revalidate: true
	})

	const event: CalendarDatum = useMemo(() => {
		return {
			item: calendarEvent.item,
			event: calendarEvent.title,
			start: calendarEvent.start.getTime().toString(),
			end: calendarEvent.end.getTime().toString(),
			allDay: calendarEvent.allDay
		}
	}, [calendarEvent])

	return (
		<CalendarForm event={event} trigger={trigger} toggleModal={toggleModal} />
	)
}
