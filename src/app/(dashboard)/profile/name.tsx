'use client'

import { useState } from 'react'

import useSWRMutation from 'swr/mutation'

import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'

import { useToggle } from '@/hooks/hooks'

export default function Name({ name }: { name: string }) {
	const fetcher = async (url: string, { arg }: { arg: { name: string } }) =>
		fetch(url, {
			method: 'PUT',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation('/api/details', fetcher, {
		revalidate: true
	})

	const [newName, setNewName] = useState(name)

	const [editButtonPressed, toggleEdit] = useToggle(false)

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => [
		setNewName(e.target.value)
	]

	const handleEditButtonPressed = () => {
		toggleEdit()
	}

	const handleSubmit = () => {
		trigger({ name: newName })
	}

	return (
		<div className='h-full w-full flex gap-2 justify-center items-center pb-10'>
			{!editButtonPressed && (
				<>
					<h2 className='text-xl font-semibold'>{name}</h2>
					<button onClick={handleEditButtonPressed}>
						<EditIcon fontSize='medium' />
					</button>
				</>
			)}
			{editButtonPressed && (
				<>
					<input
						type='text'
						name='newName'
						value={newName}
						onChange={handleNameChange}
					/>
					<input
						className='bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer hover:disabled:bg-green-100 hover:disabled:cursor-default disabled:bg-green-100'
						type='submit'
						onClick={handleSubmit}
						value='Update'
						disabled={newName == name}
					/>
					<button onClick={handleEditButtonPressed}>
						<CloseIcon fontSize='medium' />
					</button>
				</>
			)}
		</div>
	)
}
