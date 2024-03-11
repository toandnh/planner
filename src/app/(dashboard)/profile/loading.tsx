import Skeleton from '@mui/material/Skeleton'

export default function Loading() {
	return (
		<div className='min-h-[80vh] flex flex-col p-10'>
			<div className='h-full w-full flex gap-2 justify-center items-center pb-10'>
				<Skeleton variant='rectangular' width={210} height={28} />
			</div>
			<div className='min-h-[60vh] flex flex-col justify-center items-center gap-10 border-2 rounded-md'>
				<div className='flex justify-center gap-5'>
					<div className='flex flex-col gap-5'>
						<Skeleton variant='rectangular' width={300} height={25} />
						<Skeleton variant='rectangular' width={300} height={25} />
						<Skeleton variant='rectangular' width={300} height={25} />
					</div>
					<div className='flex flex-col gap-5'>
						<Skeleton variant='rectangular' width={300} height={25} />
						<Skeleton variant='rectangular' width={300} height={25} />
						<Skeleton variant='rectangular' width={300} height={25} />
					</div>
				</div>
				<Skeleton variant='rectangular' width={210} height={25} />
				<Skeleton variant='rectangular' width={210} height={65} />
			</div>
		</div>
	)
}
