'use client'

import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import { showEdits, updateShowEdits } from '@/lib/features/health/healthSlice'

import CalorieUpdateForm from './calorieUpdateForm'

import DeleteButton from '@/components/buttons/deleteButton'

export default function CalorieItem({ datum }: { datum: CalorieDatum }) {
	const editOpened: boolean =
		useAppSelector(showEdits).get(datum.item!) || false
	const dispatch = useAppDispatch()

	const handleEditClick = () =>
		dispatch(updateShowEdits({ taskItem: datum.item, editOpened: !editOpened }))

	return (
		<div className='flex flex-col gap-2'>
			<div className='w-full flex gap-5'>
				<p className='w-1/3'>{datum.activity}: </p>
				<p className='w-1/3'>{datum.amount} kcal</p>
				<button className='w-1/6' onClick={handleEditClick}>
					{editOpened ? (
						<CloseIcon fontSize='medium' />
					) : (
						<EditIcon fontSize='medium' />
					)}
				</button>
				<DeleteButton url={'/api/health/calorie'} item={datum.item} />
			</div>
			{editOpened && <CalorieUpdateForm datum={datum} />}
		</div>
	)
}
