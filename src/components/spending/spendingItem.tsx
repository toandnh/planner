export default function SpendingItem({ datum }: { datum: SpendingDatum }) {
	return (
		<div className='w-3/4 flex gap-5'>
			<p className='w-1/3'>{datum.spending}</p>
			<p className='w-1/3'>{datum.amount} CAD</p>
			<p className='w-1/3'>{datum.category}</p>
		</div>
	)
}
