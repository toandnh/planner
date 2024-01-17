'use client'

import useSWRMutation from 'swr/mutation'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

export default function TodosDeleteButton({
	userId,
	item
}: {
	userId: string
	item: string
}) {
	const fetcher = async (url: string, { arg }: { arg: { item: string } }) =>
		fetch(url, {
			method: 'DELETE',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation(`/api/todo?userId=${userId}`, fetcher, {
		revalidate: true
	})

	const handleDelete =
		(item: string) => async (e: React.MouseEvent<HTMLButtonElement>) => {
			await trigger({ item })
		}

	return (
		<button onClick={handleDelete(item)}>
			<DeleteForeverIcon fontSize='large' />
		</button>
	)
}
