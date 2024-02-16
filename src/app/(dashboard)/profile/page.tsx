'use client'

import { useSession } from 'next-auth/react'

import useSWR from 'swr'

import Name from './name'
import Profile from './profile'

export default function ProfilePage() {
	const { data: session, status } = useSession()

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR('api/health', fetcher)

	return (
		<div className='bg-slate-100 min-h-[80vh] flex flex-col p-10'>
			{session?.user && <Name name={session?.user.name} />}

			{!isLoading && <Profile data={data} />}
		</div>
	)
}
