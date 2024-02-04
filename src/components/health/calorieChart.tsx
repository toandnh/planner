'use client'

import { useState } from 'react'

import clsx from 'clsx'

import WeekChart from '../chart/weekChart'
import CalorieWeekChart from './calorieWeekChart'

import MonthChart from '../chart/monthChart'
import CalorieMonthChart from './calorieMonthChart'

export default function CalorieChart() {
	const [currChartType, setCurrChartType] = useState('week')

	const handleWeekChart = () => {
		setCurrChartType('week')
	}

	const handleMonthChart = () => {
		setCurrChartType('month')
	}

	return (
		<div className='flex flex-col justify-center gap-5'>
			<h3 className='text-xl font-semibold'>Calorie Chart</h3>
			<div className='flex justify-center'>
				<input
					className={clsx(
						'bg-neutral-500 flex items-center justify-center px-2 rounded-l-md hover:bg-neutral-600 hover:cursor-pointer',
						currChartType === 'week' ? 'underline' : ''
					)}
					type='button'
					onClick={handleWeekChart}
					value='Week'
				/>
				<input
					className={clsx(
						'bg-neutral-500 flex items-center justify-center px-2 rounded-r-md border-l-2 hover:bg-neutral-600 hover:cursor-pointer',
						currChartType === 'month' ? 'underline' : ''
					)}
					type='button'
					onClick={handleMonthChart}
					value='Month'
				/>
			</div>
			{currChartType === 'week' && (
				<WeekChart Chart={CalorieWeekChart} tabName={'health/calorie'} />
			)}
			{currChartType === 'month' && (
				<MonthChart Chart={CalorieMonthChart} tabName={'health/calorie'} />
			)}
		</div>
	)
}
