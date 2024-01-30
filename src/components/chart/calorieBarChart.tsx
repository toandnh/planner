import { axisClasses, BarChart } from '@mui/x-charts'

export default function CalorieBarChart({ dataset }: { dataset: ChartData[] }) {
	const chartSetting = {
		yAxis: [
			{
				label: 'Amount (kcal)'
			}
		],
		width: 500,
		height: 500,
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
