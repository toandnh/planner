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
	gender: string
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

type CalendarDatum = {
	[key: string]: string | boolean
	item: string
	event: string
	start: string
	end: string
	allDay: boolean
}

type EventType = {
	[key: string]: string | Date | boolean
	item: string
	title: string
	start: Date
	end: Date
	allDay: boolean
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
