'use client'

import { useMemo } from 'react'

import useSWRMutation from 'swr/mutation'

import CalendarForm from './calendarForm'

export default function CalendarAddForm({
	eventPeriod,
	toggleModal
}: {
	eventPeriod: { start: string; end: string }
	toggleModal: Function
}) {
	const fetcher = async (url: string, { arg }: { arg: CalendarDatum }) =>
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation('/api/calendar', fetcher, {
		revalidate: true
	})

	const event = useMemo(() => {
		return {
			item: `calendar#${new Date().getTime()}`,
			event: '',
			start: eventPeriod.start,
			end: eventPeriod.end,
			allDay: false
		}
	}, [eventPeriod])

	return (
		<CalendarForm event={event} trigger={trigger} toggleModal={toggleModal} />
	)
}
