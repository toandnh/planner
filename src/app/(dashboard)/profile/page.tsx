'use client'

import { useSession } from 'next-auth/react'

import TabsProfile from './tabs'

export default function ProfilePage() {
	const { data: session, status } = useSession()

	if (status === 'loading') {
		//
	}

	return (
		<div className='bg-slate-100 min-h-[80vh] h-[100vh] p-20 mt-10'>
			<div className='flex justify-center pb-5'>
				<h2 className='text-xl font-semibold'>{session?.user.name}</h2>
			</div>

			<TabsProfile />
		</div>
	)
}
