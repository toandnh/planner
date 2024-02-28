'use client'

import { useState } from 'react'

import WeekChart from '../chart/weekChart'
import MonthChart from '../chart/monthChart'

import SpendingTimeChart from './spendingTimeChart'

export default function SpendingChart() {
	const [chartType, setChartType] = useState('Week')

	const handleChartTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setChartType(e.target.options[e.target.selectedIndex].text)
	}

	return (
		<div className='flex flex-col justify-center gap-5'>
			<div className='flex gap-2'>
				<h3 className='text-xl font-semibold'>Spending Chart</h3>
				<select
					className='p-1'
					value={chartType}
					onChange={handleChartTypeChange}
					name='chartType'
				>
					<option value='Week'>Week</option>
					<option value='Month'>Month</option>
				</select>
			</div>
			{chartType == 'Week' && (
				<WeekChart Chart={SpendingTimeChart} tabName={'spending'} />
			)}
			{chartType == 'Month' && (
				<MonthChart Chart={SpendingTimeChart} tabName={'spending'} />
			)}
		</div>
	)
}
