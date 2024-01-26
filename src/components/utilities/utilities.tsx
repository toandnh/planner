function getTodosData(data: TodoDatum[], isLoading: boolean, type: string) {
	let returnData: TodoDatum[] = []
	if (!isLoading) {
		// If there is data
		if (data.length > 0) {
			data.map((datum: TodoDatum) => {
				if (type == 'completed' ? datum.completed : !datum.completed)
					returnData.push(datum)
			})
		}
	}
	return returnData
}

export function getInProgressData(data: TodoDatum[], isLoading: boolean) {
	return getTodosData(data, isLoading, 'in-progress')
}

export function getCompletedData(data: TodoDatum[], isLoading: boolean) {
	return getTodosData(data, isLoading, 'completed')
}

function getCalorieData(
	data: CalorieDatum[],
	isLoading: boolean,
	type: string
) {
	let returnData: CalorieDatum[] = []
	if (!isLoading) {
		// If there is data
		if (data.length > 0) {
			data.map((datum: CalorieDatum) => {
				if (type == 'consumed' ? datum.consumed : !datum.consumed)
					returnData.push(datum)
			})
		}
	}
	return returnData
}

export function getComsumedData(data: CalorieDatum[], isLoading: boolean) {
	return getCalorieData(data, isLoading, 'consumed')
}

export function getBurntData(data: CalorieDatum[], isLoading: boolean) {
	return getCalorieData(data, isLoading, 'burnt')
}

function sort(data: TodoDatum[], sortBy: string, asc: boolean) {
	let returnData: TodoDatum[] = data.sort((a, b) => {
		let { [sortBy]: sortByA } = a
		let { [sortBy]: sortByB } = b
		return sortByA > sortByB
			? asc
				? 1
				: -1
			: sortByB > sortByA
			? asc
				? -1
				: 1
			: 0
	})
	return returnData
}

export function sortByTaskNameAsc(data: TodoDatum[]) {
	return sort(data, 'task', true)
}

export function sortByTaskNameDsc(data: TodoDatum[]) {
	return sort(data, 'task', false)
}

export function sortByTaskPriorityAsc(data: TodoDatum[]) {
	return sort(data, 'priority', true)
}

export function sortByTaskPriorityDsc(data: TodoDatum[]) {
	return sort(data, 'priority', false)
}
