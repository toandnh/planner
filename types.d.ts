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

type ChartData = {
	consumed: number
	burnt: number
	time: string
}
