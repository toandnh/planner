'use client'

import Link from 'next/link'

import clsx from 'clsx'

import { Orbitron } from 'next/font/google'

import AccountPopover from './accountPopover'

const text = Orbitron({
	subsets: ['latin'],
	weight: ['400']
})

export default function Header() {
	return (
		<div className='w-full flex justify-between'>
			<Link href='/' className='flex justify-start items-center'>
				<h1
					className={clsx(
						'text-3xl text-neutral-900 font-semibold',
						text.className
					)}
				>
					Planner
				</h1>
			</Link>
			<AccountPopover />
		</div>
	)
}
