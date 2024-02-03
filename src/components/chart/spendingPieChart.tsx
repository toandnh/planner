import { PieChart } from '@mui/x-charts/PieChart'

export default function SpendingPieChart({
	dataset
}: {
	dataset: SpendingChartData[]
}) {
	return (
		<PieChart
			series={[
				{
					data: dataset,
					highlightScope: { faded: 'global', highlighted: 'item' },
					faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
				}
			]}
			height={300}
		/>
	)
}
