type TodoDatum = {
	item: string
	task: string
	taskItems: (string | boolean)[][]
	priority: string
	completed: boolean
	[key: string]: string | (string | boolean)[][] | boolean
}

type HealthDatum = {
	height: string
	weight: string
	goal: string
	amount: string
	[key: string]: string
}

type CalorieDatum = {
	item: string
	consumed: boolean
	activity: string
	amount: string
	[key: string]: string | boolean
}
