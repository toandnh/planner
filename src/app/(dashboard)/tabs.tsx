'use client'

import Link from 'next/link'

import { useSearchParams } from 'next/navigation'

import clsx from 'clsx'

import TabHome from './[tabs]/page'

export default function Tabs() {
	const searchParams = useSearchParams()
	const tab = searchParams.get('tab')

	return (
		<div className='bg-slate-100 min-h-screen w-full flex flex-row gap-2'>
			<div className='h-full w-1/5 flex flex-col items-center'>
				<Link
					className='w-full border-b-2 p-5'
					href={{ pathname: '/', query: { tab: 'calendar' } }}
				>
					<h2
						className={clsx(
							'text-black text-center font-semibold',
							tab == 'calendar' || tab == null
								? 'font-bold underline underline-offset-2'
								: ''
						)}
					>
						Calendar
					</h2>
				</Link>

				<Link
					className='w-full border-b-2 p-5'
					href={{ pathname: '/', query: { tab: 'todos' } }}
				>
					<h2
						className={clsx(
							'text-black text-center font-semibold',
							tab == 'todos' ? 'font-bold underline underline-offset-2' : ''
						)}
					>
						Todo
					</h2>
				</Link>

				<Link
					className='w-full border-b-2 p-5'
					href={{ pathname: '/', query: { tab: 'health' } }}
				>
					<h2
						className={clsx(
							'text-black text-center font-semibold',
							tab == 'health' ? 'font-bold underline underline-offset-2' : ''
						)}
					>
						Health
					</h2>
				</Link>

				<Link
					className='w-full border-b-2 p-5'
					href={{ pathname: '/', query: { tab: 'spending' } }}
				>
					<h2
						className={clsx(
							'text-black text-center font-semibold',
							tab == 'spending' ? 'font-bold underline underline-offset-2' : ''
						)}
					>
						Spending
					</h2>
				</Link>
			</div>

			<TabHome />
		</div>
	)
}
