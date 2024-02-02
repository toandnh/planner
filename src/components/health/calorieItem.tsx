'use client'

import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'

import CalorieUpdateForm from './calorieUpdateForm'

import DeleteButton from '@/buttons/deleteButton'

import { useToggle } from '@/hooks/useToggle'

export default function CalorieItem({ datum }: { datum: CalorieDatum }) {
	const [editOpened, toggle] = useToggle(false)

	return (
		<div className='flex flex-col gap-2'>
			<div className='w-full flex gap-5'>
				<p className='w-1/3'>{datum.activity}: </p>
				<p className='w-1/3'>{datum.amount} kcal</p>
				<button className='w-1/6' onClick={toggle}>
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
