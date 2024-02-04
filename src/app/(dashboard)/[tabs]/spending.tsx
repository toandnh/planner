'use client'

import useSWR from 'swr'

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

	return (
		<div className='w-full flex flex-col gap-10 p-10 border-l-2'>
			{!isLoading && (
				<>
					<SpendingChart />
					<SpendingItemList data={data} isLoading={isLoading} />
				</>
			)}
		</div>
	)
}
