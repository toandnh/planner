import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'

export default function ChartLayout({
	data,
	Chart,
	handlePrevClick,
	handleNextClick,
	handleFastForwardClick,
	prevClickDisabled,
	nextClickDisabled,
	fforwardClickDisabled,
	tabName,
	startTime,
	endTime
}: {
	data: CalorieDatum[]
	Chart: React.FunctionComponent<any>
	handlePrevClick: React.MouseEventHandler<HTMLButtonElement>
	handleNextClick: React.MouseEventHandler<HTMLButtonElement>
	handleFastForwardClick: React.MouseEventHandler<HTMLButtonElement>
	prevClickDisabled: boolean
	nextClickDisabled: boolean
	fforwardClickDisabled: boolean
	tabName: string
	startTime: string
	endTime: string
}) {
	return (
		<>
			<div className='p-5'>
				{startTime} - {endTime}
			</div>
			<div className='flex justify-center items-center gap-5'>
				<button onClick={handlePrevClick} disabled={prevClickDisabled}>
					<KeyboardArrowLeftIcon
						fontSize='large'
						sx={{ color: prevClickDisabled ? 'grey' : 'black' }}
					/>
				</button>
				<Chart data={data} tabName={tabName} />
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
		</>
	)
}
