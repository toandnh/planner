'use client'

import { useState } from 'react'

import { useSession } from 'next-auth/react'

import useSWR from 'swr'

import TodoCompleted from '@/components/todo/todoCompleted'
import TodoInProgress from '@/components/todo/todoInProgress'

export default function Todo() {
	const { data: session, status } = useSession()

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR(
		`/api/todo?userId=${session?.user.id}`,
		fetcher
	)

	const [showItems, setShowItems] = useState<Map<string, boolean>>(new Map())

	const handleShowMoreClick =
		(taskName: string) => (e: React.MouseEvent<HTMLInputElement>) => {
			let updatedShowItemsMap = new Map(
				showItems.set(taskName, !showItems.get(taskName))
			)
			setShowItems(updatedShowItemsMap)
		}

	return (
		<div className='h-full w-full flex flex-col items-center gap-10 p-10 border-l-2'>
			<h2 className='text-xl font-semibold'>To-do List</h2>
			<input
				className='w-full rounded-md p-2'
				type='text'
				name='search'
				placeholder='Search...'
			/>
			<TodoInProgress
				userId={session?.user.id}
				isLoading={isLoading}
				data={data}
				handleShowMoreClick={handleShowMoreClick}
				showItems={showItems}
			/>
			<TodoCompleted
				isLoading={isLoading}
				data={data}
				handleShowMoreClick={handleShowMoreClick}
				showItems={showItems}
			/>
		</div>
	)
}
