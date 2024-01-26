'use client'

import { useMemo } from 'react'

import { useSession } from 'next-auth/react'

import useSWR from 'swr'

import CalorieConsumed from '@/components/health/calorieConsumed'
import CalorieBurnt from '@/components/health/calorieBurnt'

import { getComsumedData, getBurntData } from '@/components/utilities/utilities'

export default function HealthHome() {
	// The time from the beginning of the day
	const startTime = new Date(new Date().toDateString()).getTime()

	const { data: session, status } = useSession()

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading: isHealthLoading, data: healthData } = useSWR(
		`/api/health?userId=${session?.user.id}`,
		fetcher
	)
	const { isLoading: isCalorieLoading, data: calorieData } = useSWR(
		`/api/health/calorie?userId=${session?.user.id}&time-period=day&start-time=${startTime}`,
		fetcher
	)

	const multiplier = useMemo(() => {
		if (!isHealthLoading) {
			switch (healthData.goal) {
				case 'Lose':
					return 11 * 2.2
				case 'Maintain':
					return 15 * 2.2
				case 'Gain':
					return 18 * 2.2
				default:
					return 0
			}
		}
	}, [healthData])

	const calorieRemaining = useMemo(() => {
		if (!isHealthLoading && !isCalorieLoading) {
			// If there is data
			if (calorieData.length > 0) {
				let remained = Math.round(multiplier! * healthData.weight)
				calorieData.map((datum: CalorieDatum) => {
					remained = datum.consumed
						? remained - parseInt(datum.amount)
						: remained + parseInt(datum.amount)
				})
				return remained
			} else {
				return 0
			}
		} else {
			return 0
		}
	}, [calorieData])

	const calorieComsumed: CalorieDatum[] = useMemo(
		() => getComsumedData(calorieData, isCalorieLoading),
		[calorieData]
	)

	const calorieBurnt: CalorieDatum[] = useMemo(
		() => getBurntData(calorieData, isCalorieLoading),
		[calorieData]
	)

	return (
		<div className='w-full flex flex-col gap-10 p-10 border-l-2'>
			<h2 className='text-xl font-semibold'>
				Calorie Remaining: {calorieRemaining}kcal{' '}
				{!isHealthLoading &&
					`(${Math.round(
						multiplier! * healthData.weight
					)}kcal Recommended Daily)`}
			</h2>
			<CalorieConsumed
				userId={session?.user.id}
				data={calorieComsumed}
				isLoading={isCalorieLoading}
			/>
			<CalorieBurnt
				userId={session?.user.id}
				data={calorieBurnt}
				isLoading={isCalorieLoading}
			/>
		</div>
	)
}
