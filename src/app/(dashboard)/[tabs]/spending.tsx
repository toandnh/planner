'use client'

import useSWR from 'swr'

import CircularProgress from '@mui/material/CircularProgress'

import StoreProvider from '@/app/StoreProvider'

import SpendingChart from '@/components/spending/spendingChart'
import SpendingItemList from '@/components/spending/spendingItemList'

export default function SpendingHome() {
	const millisecInDay = 24 * 60 * 60 * 1000
	// The time from the beginning of the day
	const startTime = new Date(new Date().toDateString()).getTime()

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading, data } = useSWR(
		`/api/spending?start-time=${startTime}&end-time=${
			startTime + millisecInDay
		}`,
		fetcher
	)

	let content = (
		<div className='w-full flex flex-col gap-10 p-2 md:p-5 lg:p-10'>
			{isLoading && (
				<div className='w-full h-[50vh] flex justify-center items-center'>
					<CircularProgress />
				</div>
			)}
			{!isLoading && (
				<>
					<SpendingChart />
					<SpendingItemList data={data.results} isLoading={isLoading} />
				</>
			)}
		</div>
	)

	return <StoreProvider>{content}</StoreProvider>
}
