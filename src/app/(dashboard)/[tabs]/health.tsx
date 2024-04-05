'use client'

import { useMemo } from 'react'

import useSWR from 'swr'

import StoreProvider from '@/app/StoreProvider'

import CalorieConsumed from '@/components/health/calorieConsumed'
import CalorieBurnt from '@/components/health/calorieBurnt'

import CalorieChart from '@/components/health/calorieChart'

import { getConsumedData, getBurntData } from '@/components/utilities/utilities'

const activityLevelMap: { [key: string]: number } = {
	'Sedentary': 1.2,
	'Lightly Active': 1.375,
	'Moderately Active': 1.55,
	'Active': 1.725,
	'Very Active': 1.9
}

export default function HealthHome() {
	const millisecInDay = 24 * 60 * 60 * 1000

	const fetcher = (url: string) => fetch(url).then((res) => res.json())
	const { isLoading: isHealthLoading, data: healthData } = useSWR(
		'/api/health',
		fetcher
	)

	// The time from the beginning of the day
	const startTime = new Date(new Date().toDateString()).getTime()

	const { isLoading: isCalorieLoading, data: calorieData } = useSWR(
		`/api/health/calorie?start-time=${startTime}&end-time=${
			startTime + millisecInDay
		}`,
		fetcher
	)

	const recommendedCalorie = useMemo(() => {
		if (!isHealthLoading) {
			// Mifflin-St Jeor equation
			let MSJEquation =
				10 * healthData.weight +
				6.25 * healthData.height -
				5 * (new Date().getFullYear() - healthData.birthYear)
			MSJEquation += healthData.gender == 'Female' ? 161 : -5
			MSJEquation *= activityLevelMap[healthData.activity]

			// 3500kcal roughly equal 1 pound (0.45kg)
			switch (healthData.goal) {
				case 'Lose':
					return Math.round(MSJEquation) - 500
				case 'Maintain':
					return Math.round(MSJEquation)
				case 'Gain':
					return Math.round(MSJEquation) + 500
				default:
					return 0
			}
		}
	}, [healthData])

	const calorieRemaining = useMemo(() => {
		if (!isHealthLoading && !isCalorieLoading) {
			// If there is data
			if (calorieData?.results?.length > 0) {
				let remained = recommendedCalorie!
				calorieData.results.map((datum: CalorieDatum) => {
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
	}, [healthData, calorieData])

	const calorieComsumed: CalorieDatum[] = useMemo(
		() => getConsumedData(calorieData?.results, isCalorieLoading),
		[calorieData]
	)

	const calorieBurnt: CalorieDatum[] = useMemo(
		() => getBurntData(calorieData?.results, isCalorieLoading),
		[calorieData]
	)

	let content = (
		<div className='w-full flex flex-col gap-10 p-2 md:p-5 lg:p-10'>
			{!isHealthLoading && !isCalorieLoading && (
				<>
					<h3 className='text-xl font-semibold'>
						Calorie Remaining: {calorieRemaining} kcal{' '}
						{!isHealthLoading &&
							`(${recommendedCalorie} kcal Recommended Daily*)`}
					</h3>
					<CalorieConsumed
						data={calorieComsumed}
						isLoading={isCalorieLoading}
					/>
					<CalorieBurnt data={calorieBurnt} isLoading={isCalorieLoading} />
					<CalorieChart />
					<p className='text-xs font-normal'>
						* Based on Mifflin-St Jeor equation; With the assumption of
						gaining/losing 1/2 - 1 pound a week
					</p>
				</>
			)}
		</div>
	)

	return <StoreProvider children={content} />
}
