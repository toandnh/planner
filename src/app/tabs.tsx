import Link from 'next/link'

import TabHome from './[tabs]/page'

export default function Tabs() {
	return (
		<div className='bg-slate-100 h-full w-full flex flex-row gap-2'>
			<div className='h-full w-1/5 flex flex-col gap-5 border-r-2 items-center'>
				<Link
					className='w-full border-b-2 mt-5'
					href={{ pathname: '/', query: { tab: 'todo' } }}
				>
					<h2 className='text-black text-center font-semibold'>Todo</h2>
				</Link>

				<Link
					className='w-full border-b-2'
					href={{ pathname: '/', query: { tab: 'health' } }}
				>
					<h2 className='text-black text-center font-semibold'>Health</h2>
				</Link>

				<Link
					className='w-full border-b-2'
					href={{ pathname: '/', query: { tab: 'calendar' } }}
				>
					<h2 className='text-black text-center font-semibold'>Calendar</h2>
				</Link>

				<Link
					className='w-full border-b-2'
					href={{ pathname: '/', query: { tab: 'spending' } }}
				>
					<h2 className='text-black text-center font-semibold'>Spending</h2>
				</Link>
			</div>

			<TabHome />
		</div>
	)
}
