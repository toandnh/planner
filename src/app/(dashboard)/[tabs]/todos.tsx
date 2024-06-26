'use client'

import { useMemo } from 'react'

import useSWR from 'swr'

import CircularProgress from '@mui/material/CircularProgress'

import StoreProvider from '@/app/StoreProvider'

import TodosSearch from '@/components/todos/todosSearch'
import TodosInProgress from '@/components/todos/todosInProgress'
import TodosCompleted from '@/components/todos/todosCompleted'

import {
	getInProgressData,
	getCompletedData
} from '@/components/utilities/utilities'

export default function Todos() {
	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR('/api/todos', fetcher)

	const inProgressData: TodoDatum[] = useMemo(
		() => getInProgressData(data?.message ? undefined : data, isLoading),
		[data]
	)

	const completedData: TodoDatum[] = useMemo(
		() => getCompletedData(data?.message ? undefined : data, isLoading),
		[data]
	)

	let content = (
		<div className='w-full flex flex-col gap-10 p-2 md:p-5 lg:p-10'>
			{isLoading && (
				<div className='w-full h-[50vh] flex justify-center items-center'>
					<CircularProgress />
				</div>
			)}
			{!isLoading && (
				<>
					<h2 className='w-full flex justify-center text-xl font-semibold'>
						To-do List
					</h2>
					<TodosSearch data={data} />
					<TodosInProgress isLoading={isLoading} data={inProgressData} />
					<TodosCompleted isLoading={isLoading} data={completedData} />
				</>
			)}
		</div>
	)

	return <StoreProvider>{content}</StoreProvider>
}
