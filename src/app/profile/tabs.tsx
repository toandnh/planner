import Link from 'next/link'

import Tab from './[tabs]/page'

export default function TabsProfile() {
	return (
		<div className='bg-slate-100 h-full w-full flex flex-col gap-2 items-center'>
			<div className='h-1/5 w-full flex flex-row gap-10 border-2 items-center justify-center'>
				<Link href={{ pathname: '/profile', query: { tab: 'health' } }}>
					<h2 className='text-black font-semibold'>Health</h2>
				</Link>

				<Link href={{ pathname: '/profile', query: { tab: 'spending' } }}>
					<h2 className='text-black font-semibold'>Spending</h2>
				</Link>
			</div>

			<Tab />
		</div>
	)
}
