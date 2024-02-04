'use client'

import { useMemo } from 'react'

import SpendingWeekChart from './spendingWeekChart'
import WeekChart from '../chart/weekChart'

export default function SpendingChart() {
	return (
		<div className='flex flex-col justify-center gap-5'>
			<h3 className='text-xl font-semibold'>Spending Chart</h3>
			<WeekChart Chart={SpendingWeekChart} tabName={'spending'} />
		</div>
	)
}
