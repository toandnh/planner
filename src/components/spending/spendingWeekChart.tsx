'use client'

import { useMemo } from 'react'

import SpendingPieChart from '../chart/spendingPieChart'

export default function SpendingWeekChart({
	data,
	isLoading
}: {
	data: SpendingDatum[]
	isLoading: boolean
}) {
	const categorySum: Map<string, number> = useMemo(() => {
		let sum: Map<string, number> = new Map()
		if (!isLoading) {
			// Something is wrong here, data is undefined after finished loading?
			if (data && data.length > 0) {
				data.map((datum) => {
					let newValue = parseInt(datum.amount)
					let existingValue = sum.get(datum.category)
					sum.set(
						datum.category,
						existingValue ? existingValue + newValue : newValue
					)
				})
			}
		}
		return sum
	}, [data])

	const dataset: SpendingChartData[] = useMemo(() => {
		let set: SpendingChartData[] = []
		categorySum.forEach((value: number, key: string) => {
			let currObj = {
				value,
				label: key
			}
			set.push(currObj)
		})
		return set
	}, [categorySum])

	return (
		<div className='flex flex-col justify-center'>
			<SpendingPieChart dataset={dataset} />
		</div>
	)
}
