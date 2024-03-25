'use client'

import useSWR from 'swr'

import clsx from 'clsx'

import StoreProvider from '@/app/StoreProvider'

import SpendingChart from '@/components/spending/spendingChart'
import SpendingItemList from '@/components/spending/spendingItemList'

import { useMediaQuery } from '@/hooks/hooks'

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

	const isBreakPoint = useMediaQuery(1028)

	let content = (
		<div
			className={clsx(
				'w-full flex flex-col gap-10 p-2 md:p-5 lg:p-10',
				isBreakPoint ? '' : 'border-l-2'
			)}
		>
			{!isLoading && (
				<>
					<SpendingChart />
					<SpendingItemList data={data.results} isLoading={isLoading} />
				</>
			)}
		</div>
	)

	return <StoreProvider children={content} />
}
