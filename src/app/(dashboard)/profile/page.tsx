'use client'

import { useSession } from 'next-auth/react'

import useSWR from 'swr'

import CircularProgress from '@mui/material/CircularProgress'

import Name from './name'
import Profile from './profile'

export default function ProfilePage() {
	const { data: session, status } = useSession()

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR('api/health', fetcher)

	return (
		<div className='min-h-[80vh] flex flex-col p-10'>
			{isLoading && (
				<div className='w-full h-[50vh] flex justify-center items-center'>
					<CircularProgress />
				</div>
			)}
			{!isLoading && (
				<>
					{session?.user && <Name name={session?.user.name} />}
					<Profile data={data} />
				</>
			)}
		</div>
	)
}
