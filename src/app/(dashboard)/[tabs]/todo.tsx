'use client'

import React from 'react'

import { useState } from 'react'

import { useSession } from 'next-auth/react'

import useSWR from 'swr'

import clsx from 'clsx'

import ToDoAddForm from '@/components/forms/toDoAddForm'

const priorityMapping = new Map<string, string>([
	['1', 'bg-green-600'],
	['2', 'bg-lime-600'],
	['3', 'bg-yellow-600'],
	['4', 'bg-orange-600'],
	['5', 'bg-red-600']
])

export default function Todo() {
	const sortKey = 'todo'

	const { data: session, status } = useSession()

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR(
		`/api/todo?userId=${session?.user.id}&item=${sortKey}`,
		fetcher
	)

	const [isEdit, setIsEdit] = useState(false)
	const [itemIndex, setItemIndex] = useState<string | null>(null)

	const handleEditClick = (e: React.MouseEvent<HTMLInputElement>) => {
		e.preventDefault()
		setIsEdit(true)
		setItemIndex((e as any).target.value)
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

			<div className='h-full w-full flex flex-col gap-10'>
				<h3 className='justify-start text-xl font-semibold'>In Progress</h3>
				{!isLoading && (
					<table className='flex flex-col justify-center gap-10 pl-5 pt-5'>
						<thead>
							<tr className='flex'>
								<th className='w-full flex justify-start font-semibold'>
									Task
								</th>
								<th className='w-full flex justify-start font-semibold'>
									Priority
								</th>
								<th className='w-1/2 flex justify-start font-semibold'>
									<p className='hidden'>HIDDEN</p>
								</th>
								<th className='w-1/2 flex justify-start font-semibold'>
									<p className='hidden'>HIDDEN</p>
								</th>
							</tr>
						</thead>
						<tbody className='flex flex-col gap-10'>
							{data.map((record: any) => {
								return (
									<React.Fragment key={record.item}>
										{!record.completed && (
											<tr key={record.item} className='h-full flex'>
												<td className='w-full'>
													<p key={record.item}>{record.task}</p>
												</td>
												<td className='w-full'>
													<span
														key={record.item}
														className={clsx(
															priorityMapping.get(record.priority),
															'inline-block h-full w-1/2'
														)}
													></span>
												</td>
												<td className='w-1/2'>
													<input
														className='bg-orange-500 flex items-end justify-center px-2 rounded-md hover:bg-orange-600 hover:cursor-pointer'
														key={record.item}
														type='button'
														onClick={handleEditClick}
														value='Edit'
													/>
												</td>
												<td className='w-1/2'>
													<input
														className='bg-green-500 flex items-end justify-center px-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
														key={record.item}
														type='button'
														value='Done'
													/>
												</td>
											</tr>
										)}
									</React.Fragment>
								)
							})}
						</tbody>
					</table>
				)}
				<ToDoAddForm />
			</div>

			<div className='h-full w-full'>
				<h3 className='justify-start text-xl font-semibold pb-5'>Completed</h3>
				<div className='flex flex-col gap-3 pl-5'>
					{!isLoading &&
						data.map((record: any) => {
							if (record.completed)
								return <p key={record.item}>{record.task}</p>
						})}
				</div>
			</div>
		</div>
	)
}
