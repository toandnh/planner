import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'

import CalorieAverage from './calorieAverage'

export default function CalorieChartItem({
	data,
	CalorieTimeChart,
	calorieArr,
	timeAverage,
	handlePrevClick,
	handleNextClick,
	handleFastForwardClick,
	prevClickDisabled,
	nextClickDisabled,
	fforwardClickDisabled
}: {
	data: CalorieDatum[]
	CalorieTimeChart: React.FunctionComponent<{
		data: CalorieDatum[]
		calorieArr: number[][]
	}>
	calorieArr: number[][]
	timeAverage: number[]
	handlePrevClick: React.MouseEventHandler<HTMLButtonElement>
	handleNextClick: React.MouseEventHandler<HTMLButtonElement>
	handleFastForwardClick: React.MouseEventHandler<HTMLButtonElement>
	prevClickDisabled: boolean
	nextClickDisabled: boolean
	fforwardClickDisabled: boolean
}) {
	return (
		<>
			<div className='flex justify-center items-center gap-5'>
				<button onClick={handlePrevClick} disabled={prevClickDisabled}>
					<KeyboardArrowLeftIcon
						fontSize='large'
						sx={{ color: prevClickDisabled ? 'grey' : 'black' }}
					/>
				</button>
				<CalorieTimeChart data={data} calorieArr={calorieArr} />
				<button onClick={handleNextClick} disabled={nextClickDisabled}>
					<KeyboardArrowRightIcon
						fontSize='large'
						sx={{ color: nextClickDisabled ? 'grey' : 'black' }}
					/>
				</button>
				<button
					onClick={handleFastForwardClick}
					disabled={fforwardClickDisabled}
				>
					<KeyboardDoubleArrowRightIcon
						fontSize='large'
						sx={{ color: fforwardClickDisabled ? 'grey' : 'black' }}
					/>
				</button>
			</div>
			<CalorieAverage average={timeAverage} />
		</>
	)
}
