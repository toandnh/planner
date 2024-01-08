'use client'

import { useEffect, useMemo, useState } from 'react'

import useSWRMutation from 'swr/mutation'

import TodoForm from './todoForm'

export default function TodoUpdateForm({
	userId,
	datum
}: {
	userId: string
	datum: TodoDatum
}) {
	const fetcher = async (url: string, { arg }: { arg: TodoDatum }) =>
		fetch(url, {
			method: 'PUT',
			body: JSON.stringify(arg)
		}).then((res) => res.json())
	const { trigger } = useSWRMutation(`/api/todo?userId=${userId}`, fetcher, {
		revalidate: true
	})

	const numRowLimit = 3

	let index: number = useMemo(() => {
		return parseInt(datum.item!.split('#')[1])
	}, [datum])

	let items: string[] = useMemo(() => {
		let arr: string[] = []
		if (datum.taskItems) {
			datum.taskItems.forEach((taskItem) => {
				arr.push(taskItem[0] as string)
			})
		}
		return arr.concat(Array(numRowLimit).fill(''))
	}, [datum])

	const [stateChanged, setStateChanged] = useState(false)
	const [firstTime, setFirstTime] = useState(true)

	const [totalRowLimit, setTotalRowLimit] = useState(numRowLimit)

	const [taskName, setTaskName] = useState(datum.task)
	const [taskPriority, setTaskPriority] = useState(
		parseInt(datum.priority as string)
	)
	const [taskItems, setTaskItems] = useState(items)

	useEffect(() => {
		// If any of the dependencies changed, then enable the trigger button
		setStateChanged(!firstTime && taskName && taskItems.length ? true : false)
		setFirstTime(false)
	}, [taskName, taskItems, taskPriority])

	const handleAddMoreItems = (e: React.KeyboardEvent | React.MouseEvent) => {
		// Keyboard stuff here
		if (
			e.type === 'keydown' &&
			((e as React.KeyboardEvent).key === 'Tab' ||
				(e as React.KeyboardEvent).key === 'Shift')
		) {
			return
		}

		// Set new limit every time the function is called
		setTotalRowLimit(totalRowLimit + numRowLimit)
		// Increase the limit of the taskItems array
		setTaskItems([...taskItems, ...Array(numRowLimit).fill('')])
	}

	const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setTaskName(e.target.value)

	const handleTaskPriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		setTaskPriority(5 - e.target.selectedIndex)

	const handleTaskItemChange =
		(index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
			let updatedTaskItems = taskItems.map((item, i) => {
				return i === index ? e.target.value : item
			})
			setTaskItems(updatedTaskItems)
		}

	const handleSubmit = async () => {
		// Turn taskItems into a map
		const taskItemTuples: (string | boolean)[][] = new Array()
		taskItems.map((item) => {
			// Only return non-empty items
			if (item) taskItemTuples.push([item, false])
		})

		await trigger({
			item: `todo#${index}`,
			task: taskName,
			taskItems: taskItemTuples,
			priority: `${taskPriority}`,
			completed: false
		})

		// Reset input fields
		setTaskName(datum.task)
		setTaskItems([...items, ...Array(numRowLimit).fill('')])
		setTaskPriority(parseInt(datum.priority!))
	}

	return (
		<div className='bg-gray-400 flex flex-col justify-center gap-5 p-5'>
			<TodoForm
				datum={{ task: taskName!, priority: taskPriority, taskItems }}
				handleSubmit={handleSubmit}
				handleTaskChange={handleTaskChange}
				handleTaskPriorityChange={handleTaskPriorityChange}
				handleAddMoreItems={handleAddMoreItems}
				handleTaskItemChange={handleTaskItemChange}
				stateChanged={stateChanged}
			/>
		</div>
	)
}
