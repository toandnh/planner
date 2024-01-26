export default function CalorieItem({ datum }: { datum: CalorieDatum }) {
	return (
		<div className='w-2/3 flex justify-between'>
			<p>{datum.activity}: </p>
			<p>{datum.amount} kcal</p>
		</div>
	)
}
