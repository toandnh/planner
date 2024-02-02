'use client'

import { useMemo } from 'react'

import { useSession } from 'next-auth/react'

import useSWR from 'swr'

import StoreProvider from '@/app/StoreProvider'

import TodosSearch from '@/components/todos/todosSearch'
import TodosInProgress from '@/components/todos/todosInProgress'
import TodosCompleted from '@/components/todos/todosCompleted'

import {
	getInProgressData,
	getCompletedData
} from '@/components/utilities/utilities'

export default function Todos() {
	const { data: session, status } = useSession()

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR(
		`/api/todos?userId=${session?.user.id}`,
		fetcher
	)

	console.log(data)

	const inProgressData: TodoDatum[] = useMemo(
		() => getInProgressData(data, isLoading),
		[data]
	)

	const completedData: TodoDatum[] = useMemo(
		() => getCompletedData(data, isLoading),
		[data]
	)

	let content = (
		<div className='h-full w-full flex flex-col items-center gap-10 p-10 border-l-2'>
			<h2 className='text-xl font-semibold'>To-do List</h2>
			<TodosSearch userId={session?.user.id} data={data} />
			<TodosInProgress
				userId={session?.user.id}
				isLoading={isLoading}
				data={inProgressData}
			/>
			<TodosCompleted
				userId={session?.user.id}
				isLoading={isLoading}
				data={completedData}
			/>
		</div>
	)

	return <StoreProvider children={content} />
}
