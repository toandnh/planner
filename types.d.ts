type TodoDatum = {
	[key: string]: string | (string | boolean)[][] | boolean
	item: string
	task: string
	taskItems: (string | boolean)[][]
	priority: string
	completed: boolean
}

type HealthDatum = {
	[key: string]: string
	height: string
	weight: string
	goal: string
	amount: string
}

type CalorieDatum = {
	[key: string]: string | boolean
	item: string
	consumed: boolean
	activity: string
	amount: string
	date: string
}

type SpendingDatum = {
	[key: string]: string
	item: string
	spending: string
	amount: string
	category: string
	date: string
}

type CalorieChartData = {
	consumed: number
	burnt: number
	time: string
}

type SpendingChartData = {
	value: number
	label: string
}
