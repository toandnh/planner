export default function CalorieAverage({ average }: { average: number[] }) {
	return (
		<div className='flex flex-col gap-5 pl-5'>
			<p>Average Total Calorie: {average[0]} kcal</p>
			<p>Average Calorie Consumed: {average[1]} kcal</p>
			<p>Average Calorie Burnt: {average[2]} kcal</p>
		</div>
	)
}
