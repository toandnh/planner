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

	const handleDelete = async (item: string) => {
		await trigger({ item })

		// Since delete urls contain only userId param
		// it should be shorter than other urls
		// hence, sufficient to use it to revalidate
		mutate((key) => typeof key === 'string' && key.startsWith(url))
	}

	return (
		<button onClick={() => handleDelete(item)}>
			<DeleteForeverIcon fontSize='medium' />
		</button>
	)
}
