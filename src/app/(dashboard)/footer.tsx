import { Orbitron } from 'next/font/google'

import clsx from 'clsx'

const text = Orbitron({
	subsets: ['latin'],
	weight: ['400']
})

export default function Footer() {
	return (
		<div
			className={clsx(
				'flex items-center pt-10 text-3xl text-neutral-900 font-semibold',
				text.className
			)}
		>
			This is a footer
		</div>
	)
}
