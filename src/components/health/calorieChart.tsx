'use client'

import { useState } from 'react'

import clsx from 'clsx'

import WeekChart from '../chart/weekChart'
import CalorieWeekChart from './calorieWeekChart'

import YearChart from '../chart/yearChart'
import CalorieYearChart from './calorieYearChart'

export default function CalorieChart() {
	const [currChartType, setCurrChartType] = useState('week')

	const handleWeekChart = () => {
		setCurrChartType('week')
	}

	const handleYearChart = () => {
		setCurrChartType('year')
	}

	return (
		<div className='flex flex-col justify-center gap-5'>
			<h3 className='text-xl font-semibold'>Calorie Chart</h3>
			<div className='flex justify-center items-center'>
				<div className='w-1/2 grid grid-cols-2 justify-center'>
					<input
						className={clsx(
							'bg-orange-200 flex items-center justify-center px-2 rounded-l-md hover:bg-orange-300 hover:cursor-pointer',
							currChartType === 'week' ? 'underline' : ''
						)}
						type='button'
						onClick={handleWeekChart}
						value='Week'
					/>
					<input
						className={clsx(
							'bg-orange-200 flex items-center justify-center px-2 rounded-r-md border-l-2 hover:bg-orange-300 hover:cursor-pointer',
							currChartType === 'year' ? 'underline' : ''
						)}
						type='button'
						onClick={handleYearChart}
						value='Year'
					/>
				</div>
			</div>
			{currChartType === 'week' && (
				<WeekChart Chart={CalorieWeekChart} tabName={'health/calorie'} />
			)}
			{currChartType === 'year' && (
				<YearChart Chart={CalorieYearChart} tabName={'health/calorie'} />
			)}
		</div>
	)
}
