'use client'

import { useSession } from 'next-auth/react'

import TabsProfile from './tabs'

export default function ProfilePage() {
	const { data: session, status } = useSession()

	if (status === 'loading') {
		//
	}

	return (
		<div className='bg-slate-100 min-h-screen flex flex-col p-10'>
			<h2 className='h-full w-full flex justify-center items-center text-xl font-semibold pb-10'>
				{session?.user.name}
			</h2>

			<TabsProfile />
		</div>
	)
}
