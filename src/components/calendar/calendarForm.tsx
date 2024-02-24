'use client'

import { useEffect, useState } from 'react'

import { mutate } from 'swr'

import CalendarDeleteButton from './calendarDeleteButton'

import { useToggle } from '@/hooks/hooks'

export default function CalendarForm({
	event,
	trigger,
	toggleModal
}: {
	event: CalendarDatum
	trigger: Function
	toggleModal: Function
}) {
	const [title, setTitle] = useState(event.event)
	const [allDay, toggleAllDay] = useToggle(event.allDay)

	const [stateChanged, setStateChanged] = useState(false)

	useEffect(() => {
		let titleChanged = title !== event.event
		let allDayChanged = allDay !== event.allDay

		// If any of the dependencies changed, then enable the trigger button
		setStateChanged(title && (titleChanged || allDayChanged) ? true : false)
	}, [title, allDay])

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value)
	}

	const handleAllDayChange = () => {
		toggleAllDay()
	}

	const handleSubmit = async () => {
		await trigger({
			item: event.item,
			event: title,
			start: event.start,
			end: event.end,
			allDay
		})

		// Revalidate all data from 'api/calendar...'
		mutate((key) => typeof key === 'string' && key.startsWith('/api/calendar'))

		toggleModal()
	}

	return (
		<div className='bg-neutral-500 w-2/3 h-2/3 flex flex-col justify-center items-center gap-5 p-5 rounded-md'>
			<input
				className='w-full'
				type='text'
				value={title}
				onChange={handleTitleChange}
				placeholder='Event Name'
			/>
			<div className='w-full flex justify-center gap-2'>
				<label className='text-sm font-medium'>All Day</label>
				<input
					className='w-1/3'
					type='checkbox'
					checked={allDay}
					onChange={handleAllDayChange}
				/>
			</div>
			<input
				className='w-full bg-green-400 flex items-end justify-center px-2 rounded-md hover:bg-green-500 hover:cursor-pointer hover:disabled:bg-green-300 hover:disabled:cursor-default disabled:bg-green-300'
				type='button'
				onClick={handleSubmit}
				value={event.event ? 'Update' : 'Add'}
				disabled={!stateChanged}
			/>

			{event.event && (
				<div className='w-full h-full flex pt-5 border-t-2'>
					<CalendarDeleteButton item={event.item} toggleModal={toggleModal} />
				</div>
			)}
		</div>
	)
}
