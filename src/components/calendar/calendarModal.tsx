'use client'

import useSWRMutation from 'swr/mutation'

export default function CalendarModal() {
	const fetcher = async (url: string, { arg }: { arg: CalendarDatum }) =>
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation('/api/calendar', fetcher, {
		revalidate: true
	})

	const handleSubmit = async () => {
		// trigger({})
	}

	return <></>
}
