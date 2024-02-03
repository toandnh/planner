'use client'

import { useMemo } from 'react'

import SpendingPieChart from '../chart/spendingPieChart'

export default function SpendingChart({ data }: { data: SpendingDatum[] }) {
	const categorySum: Map<string, number> = useMemo(() => {
		let sum: Map<string, number> = new Map()
		data.map((datum) => {
			let newValue = parseInt(datum.amount)
			let existingValue = sum.get(datum.category)
			sum.set(
				datum.category,
				existingValue ? existingValue + newValue : newValue
			)
		})
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

	return <SpendingPieChart dataset={dataset} />
}
