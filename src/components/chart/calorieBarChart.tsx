import { axisClasses, BarChart } from '@mui/x-charts'

import { useMediaQuery, useScreenSize } from '@/hooks/hooks'

export default function CalorieBarChart({
	dataset
}: {
	dataset: CalorieChartData[]
}) {
	const isBreakPoint = useMediaQuery(601)
	const screenSize = useScreenSize()

	const chartSetting = {
		yAxis: [
			{
				label: 'Amount (kcal)'
			}
		],
		width: isBreakPoint ? screenSize.width / 2 : screenSize.width / 3,
		height: isBreakPoint ? screenSize.width / 2 : screenSize.width / 3,
		sx: {
			[`.${axisClasses.left} .${axisClasses.label}`]: {
				transform: 'translate(-12px, 0)'
			}
		}
	}

	const valueFormatter = (value: number | null) => `${value} kcal`

	return (
		<BarChart
			dataset={dataset}
			xAxis={[{ scaleType: 'band', dataKey: 'time' }]}
			series={[
				{ dataKey: 'consumed', label: 'Consumed', valueFormatter },
				{ dataKey: 'burnt', label: 'Burnt', valueFormatter }
			]}
			{...chartSetting}
		/>
	)
}
