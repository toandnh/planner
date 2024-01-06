'use client'

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
				isLoading={isLoading}
				data={data}
				userId={session?.user.id}
			/>
			<TodoCompleted isLoading={isLoading} data={data} />
		</div>
	)
}
