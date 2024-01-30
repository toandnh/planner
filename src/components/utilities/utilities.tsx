function getTodosData(
	data: TodoDatum[],
	isLoading: boolean,
	type: string
): TodoDatum[] {
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

export function getInProgressData(
	data: TodoDatum[],
	isLoading: boolean
): TodoDatum[] {
	return getTodosData(data, isLoading, 'in-progress')
}

export function getCompletedData(
	data: TodoDatum[],
	isLoading: boolean
): TodoDatum[] {
	return getTodosData(data, isLoading, 'completed')
}

function getCalorieData(
	data: CalorieDatum[],
	isLoading: boolean,
	type: string
): CalorieDatum[] {
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

export function getComsumedData(
	data: CalorieDatum[],
	isLoading: boolean
): CalorieDatum[] {
	return getCalorieData(data, isLoading, 'consumed')
}

export function getBurntData(
	data: CalorieDatum[],
	isLoading: boolean
): CalorieDatum[] {
	return getCalorieData(data, isLoading, 'burnt')
}

function sort(data: TodoDatum[], sortBy: string, asc: boolean): TodoDatum[] {
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

export function sortByTaskNameAsc(data: TodoDatum[]): TodoDatum[] {
	return sort(data, 'task', true)
}

export function sortByTaskNameDsc(data: TodoDatum[]): TodoDatum[] {
	return sort(data, 'task', false)
}

export function sortByTaskPriorityAsc(data: TodoDatum[]): TodoDatum[] {
	return sort(data, 'priority', true)
}

export function sortByTaskPriorityDsc(data: TodoDatum[]): TodoDatum[] {
	return sort(data, 'priority', false)
}

export function getSunday(day: Date): number {
	let dayIndex = day.getDay()
	let diff = new Date(day).getDate() - dayIndex
	return new Date(new Date(day.setDate(diff)).toDateString()).getTime()
}

export function getFirstDayOfMonth(day: Date): number {
	return new Date(day.getFullYear(), day.getMonth(), 1).getTime()
}

export function getLastDayOfMonth(day: Date): number {
	return new Date(day.getFullYear(), day.getMonth() + 1, 0).getTime()
}

export function getCalorieArr(
	data: CalorieDatum[],
	isLoading: boolean,
	arrSize: number
): number[][] {
	// In the form: [[in, out], [in, out], ...]
	let arr: number[][] = Array(arrSize)
		.fill(null)
		.map(() => Array(2).fill(0))

	if (!isLoading) {
		// Server will send empty object if there is no data
		if (data.length > 0) {
			for (let datum of data) {
				let firstIndex = getIndex(arrSize, datum.date)
				let secondIndex = datum.consumed ? 0 : 1
				arr[firstIndex][secondIndex] += parseInt(datum.amount)
			}
		}
	}

	return arr
}

function getIndex(arrSize: number, date: string): number {
	const day = new Date(parseInt(date))
	return arrSize == 7 ? day.getDay() : day.getMonth()
}

export function getAverage(
	calorieArr: number[][],
	isLoading: boolean
): number[] {
	let sum = [0, 0, 0]
	// Since calorieArr is initialized to an array of specific size,
	// and some of the data maybe missing, which may leads to dividing by zero
	let entryCount = 0

	if (!isLoading) {
		for (let entry of calorieArr) {
			if (entry[0] == 0 && entry[1] == 0) continue
			sum[0] += entry[0] - entry[1]
			sum[1] += entry[0]
			sum[2] += entry[1]
			entryCount++
		}
	}

	let calorieAverage = sum[0] === 0 ? 0 : Math.round(sum[0] / entryCount)
	let calorieInAverage = sum[1] === 0 ? 0 : Math.round(sum[1] / entryCount)
	let calorieOutAverage = sum[2] === 0 ? 0 : Math.round(sum[2] / entryCount)

	return [calorieAverage, calorieInAverage, calorieOutAverage]
}
