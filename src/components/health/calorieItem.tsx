'use client'

import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import { showEdits, updateShowEdits } from '@/lib/features/health/healthSlice'

import { useMountTransition } from '@/hooks/hooks'

import CalorieUpdateForm from './calorieUpdateForm'

import DeleteButton from '@/components/buttons/deleteButton'

export default function CalorieItem({ datum }: { datum: CalorieDatum }) {
	const showEdit: boolean = useAppSelector(showEdits).get(datum.item!) || false
	const dispatch = useAppDispatch()

	const hasTransitionedIn = useMountTransition(showEdit, 150)

	const handleEditClick = () => {
		dispatch(updateShowEdits({ taskItem: datum.item, editOpened: !showEdit }))
	}

	return (
		<div className='flex flex-col gap-2'>
			<div className='w-full flex gap-5'>
				<p className='w-1/3'>{datum.activity}: </p>
				<p className='w-1/3'>{datum.amount} kcal</p>
				<button className='w-1/6' onClick={handleEditClick}>
					{showEdit ? (
						<CloseIcon fontSize='medium' />
					) : (
						<EditIcon fontSize='medium' />
					)}
				</button>
				<DeleteButton url={'/api/health/calorie'} item={datum.item} />
			</div>
			{(hasTransitionedIn || showEdit) && (
				<div
					className={`${
						hasTransitionedIn && showEdit
							? 'opacity-100 translate-y-0 transition-{opactity} duration-200 ease-in transition-{transform} duration-200 ease-in'
							: 'opacity-0 -translate-y-6 transition-{opactity} duration-150 ease-out transition-{transform} duration-150 ease-out'
					}`}
				>
					<CalorieUpdateForm datum={datum} />
				</div>
			)}
		</div>
	)
}
