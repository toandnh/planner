'use client'

import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import {
	showEdits,
	updateShowEdits
} from '@/lib/features/spending/spendingSlice'

import SpendingUpdateForm from './spendingUpdateForm'

import DeleteButton from '@/components/buttons/deleteButton'

export default function SpendingItem({ datum }: { datum: SpendingDatum }) {
	const editOpened: boolean =
		useAppSelector(showEdits).get(datum.item!) || false
	const dispatch = useAppDispatch()

	const handleEditClick = () =>
		dispatch(updateShowEdits({ taskItem: datum.item, editOpened: !editOpened }))

	return (
		<div className='flex flex-col gap-2'>
			<div className='w-full flex'>
				<div className='w-3/4 flex gap-5'>
					<p className='w-1/3'>{datum.spending}</p>
					<p className='w-1/3'>{datum.amount} CAD</p>
					<p className='w-1/3'>{datum.category}</p>
				</div>
				<button className='w-1/6' onClick={handleEditClick}>
					{editOpened ? (
						<CloseIcon fontSize='medium' />
					) : (
						<EditIcon fontSize='medium' />
					)}
				</button>
				<DeleteButton url={'/api/spending'} item={datum.item} />
			</div>
			{editOpened && <SpendingUpdateForm datum={datum} />}
		</div>
	)
}
