import { Orbitron } from 'next/font/google'

import clsx from 'clsx'

const text = Orbitron({
	subsets: ['latin'],
	weight: ['400']
})

export default function Footer() {
	return (
		<div className='flex flex-col gap-5'>
			<div
				className={clsx(
					'flex items-center pt-10 text-3xl text-neutral-900 font-semibold',
					text.className
				)}
			>
				This is a footer
			</div>
			<p className='text-sm font-normal'>Beta version: 0.1.0</p>
		</div>
	)
}
