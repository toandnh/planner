function getData(data: TodoDatum[], isLoading: boolean, type: string) {
	let returnData: TodoDatum[] = []
	if (!isLoading) {
		data.map((datum: TodoDatum) => {
			if (type == 'completed' ? datum.completed : !datum.completed)
				returnData.push(datum)
		})
	}
	return returnData
}

export function getInProgressData(data: TodoDatum[], isLoading: boolean) {
	return getData(data, isLoading, 'inProgress')
}

export function getCompletedData(data: TodoDatum[], isLoading: boolean) {
	return getData(data, isLoading, 'completed')
}
