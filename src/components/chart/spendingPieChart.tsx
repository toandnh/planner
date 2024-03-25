import { PieChart } from '@mui/x-charts/PieChart'

import { useMediaQuery, useScreenSize } from '@/hooks/hooks'

export default function SpendingPieChart({
	dataset
}: {
	dataset: SpendingChartData[]
}) {
	const isBreakPoint = useMediaQuery(601)
	const screenSize = useScreenSize()

	return (
		<PieChart
			series={[
				{
					data: dataset,
					highlightScope: { faded: 'global', highlighted: 'item' },
					faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
				}
			]}
			slotProps={{
				legend: {
					direction: 'row',
					position: {
						vertical: 'top',
						horizontal: 'middle'
					}
				}
			}}
			height={isBreakPoint ? (screenSize.width * 2) / 3 : screenSize.width / 2}
			width={isBreakPoint ? screenSize.width / 2 : screenSize.width / 3}
		/>
	)
}
