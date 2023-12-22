'use client'

import Link from 'next/link'

import { useSearchParams } from 'next/navigation'

import clsx from 'clsx'

import Tab from './[tabs]/page'

export default function TabsProfile() {
	const searchParams = useSearchParams()
	const tab = searchParams.get('tab')

	return (
		<div className='bg-slate-100 h-screen w-full flex flex-col gap-2 items-center'>
			<div className='h-1/5 w-full flex flex-row gap-10 border-2 items-center justify-center'>
				<Link href={{ pathname: '/profile', query: { tab: 'health' } }}>
					<h2
						className={clsx(
							'text-black font-semibold',
							tab == 'health' || tab == null
								? 'font-bold underline underline-offset-2'
								: ''
						)}
					>
						Health
					</h2>
				</Link>

				<Link href={{ pathname: '/profile', query: { tab: 'spending' } }}>
					<h2
						className={clsx(
							'text-black font-semibold',
							tab == 'spending' ? 'font-bold underline underline-offset-2' : ''
						)}
					>
						Spending
					</h2>
				</Link>
			</div>

			<Tab />
		</div>
	)
}
