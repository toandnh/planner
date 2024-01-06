export default function TodoCompleted({
	isLoading,
	data
}: {
	isLoading: boolean
	data: TodoDatum[]
}) {
	return (
		<div className='h-full w-full'>
			<h3 className='justify-start text-xl font-semibold pb-5'>Completed</h3>
			<div className='flex flex-col gap-3 pl-5'>
				{!isLoading &&
					data.map((datum: any) => {
						if (datum.completed) return <p key={datum.item}>{datum.task}</p>
					})}
			</div>
		</div>
	)
}
