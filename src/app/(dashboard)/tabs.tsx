'use client'

import Link from 'next/link'

import { useSearchParams } from 'next/navigation'

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import MoneyIcon from '@mui/icons-material/Money'

import clsx from 'clsx'

import TabHome from './[tabs]/page'

export default function Tabs() {
	const searchParams = useSearchParams()
	const tab = searchParams.get('tab')

	return (
		<div className='min-h-screen w-full flex flex-col gap-2'>
			<div className='h-full w-2/3 flex items-center'>
				<Link
					className='w-full border-b-2 p-5'
					href={{ pathname: '/', query: { tab: 'calendar' } }}
				>
					<h2
						className={clsx(
							'text-black text-center font-semibold p-2 rounded-md hover:bg-rose-100',
							tab == 'calendar' || tab == null ? 'bg-rose-200' : ''
						)}
					>
						<CalendarMonthIcon fontSize='medium' />
					</h2>
				</Link>

				<Link
					className='w-full border-b-2 p-5'
					href={{ pathname: '/', query: { tab: 'todos' } }}
				>
					<h2
						className={clsx(
							'text-black text-center font-semibold p-2 rounded-md hover:bg-rose-100',
							tab == 'todos' ? 'bg-rose-200' : ''
						)}
					>
						<FormatListBulletedIcon fontSize='medium' />
					</h2>
				</Link>

				<Link
					className='w-full border-b-2 p-5'
					href={{ pathname: '/', query: { tab: 'health' } }}
				>
					<h2
						className={clsx(
							'text-black text-center font-semibold p-2 rounded-md hover:bg-rose-100',
							tab == 'health' ? 'bg-rose-200' : ''
						)}
					>
						<FitnessCenterIcon fontSize='medium' />
					</h2>
				</Link>

				<Link
					className='w-full border-b-2 p-5'
					href={{ pathname: '/', query: { tab: 'spending' } }}
				>
					<h2
						className={clsx(
							'text-black text-center font-semibold p-2 rounded-md hover:bg-rose-100',
							tab == 'spending' ? 'bg-rose-200' : ''
						)}
					>
						<MoneyIcon fontSize='medium' />
					</h2>
				</Link>
			</div>

			<TabHome />
		</div>
	)
}
