'use client'

import { mutate } from 'swr'

import useSWRMutation from 'swr/mutation'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

export default function DeleteButton({
	url,
	item
}: {
	url: string
	item: string
}) {
	const fetcher = async (url: string, { arg }: { arg: { item: string } }) =>
		fetch(url, {
			method: 'DELETE',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation(url, fetcher, {
		revalidate: true
	})

	const handleDelete = async () => {
		await trigger({ item })
		mutate((key) => typeof key === 'string' && key.startsWith(url))
	}

	return (
		<button onClick={handleDelete}>
			<DeleteForeverIcon fontSize='medium' />
		</button>
	)
}
