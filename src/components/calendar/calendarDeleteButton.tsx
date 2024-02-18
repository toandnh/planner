'use client'

import { mutate } from 'swr'

import useSWRMutation from 'swr/mutation'

export default function CalendarDeleteButton({
	item,
	toggleModal
}: {
	item: string
	toggleModal: Function
}) {
	const fetcher = async (url: string, { arg }: { arg: { item: string } }) =>
		fetch(url, {
			method: 'DELETE',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation('/api/calendar', fetcher, {
		revalidate: true
	})

	const handleDelete = async () => {
		await trigger({ item })

		// Revalidate all data from 'api/calendar...'
		mutate((key) => typeof key === 'string' && key.startsWith('/api/calendar'))

		toggleModal()
	}

	return (
		<input
			className='w-full bg-red-400 flex items-end justify-center px-2 rounded-md hover:bg-red-500 hover:cursor-pointer hover:disabled:bg-green-100 hover:disabled:cursor-default disabled:bg-green-100'
			type='button'
			onClick={handleDelete}
			value='Delete'
		/>
	)
}
