const storageKey = 'numItems'

const initialObject: { [key: string]: number } = {
	'todos-completed': 0,
	'todos-in-progress': 0,
	'calorie-time': new Date().getTime(),
	'calorie-consumed': 0,
	'calorie-burnt': 0,
	'spending-time': new Date().getTime(),
	'spending': 0
}

const storage = {
	get: (): { [key: string]: number } | null => {
		if (!localStorage.getItem(storageKey))
			localStorage.setItem(storageKey, JSON.stringify(initialObject))
		const result = localStorage.getItem(storageKey)!
		try {
			return JSON.parse(result)
		} catch {
			return null
		}
	},
	add: (key: string, value: number): void | null => {
		try {
			const object = storage.get()
			if (!object) {
				// Error
			} else {
				const firstPartOfKey = key.split('-')[0]
				if (firstPartOfKey == 'calorie' || firstPartOfKey == 'spending') {
					// Get the first hour of the day
					const today = new Date(
						new Date().getFullYear(),
						new Date().getMonth(),
						new Date().getDate()
					).getTime()
					const tomorrow = today + 24 * 60 * 60 * 1000

					const timeKey = key + '-time'
					const updatedToday =
						object[timeKey] > today && object[timeKey] < tomorrow

					// object[key] += -object[key] + value will not be negative,
					// since there has to be something to delete
					object[key] += updatedToday ? value : -object[key] + value
					object[timeKey] = updatedToday
						? object[timeKey]
						: new Date().getTime()
				} else {
					object[key] += value
				}
				localStorage.setItem(storageKey, JSON.stringify(object))
			}
		} catch {
			return null
		}
	},
	getItem: (key: string): number | null => {
		const object = storage.get()
		if (!object) return null
		return object[key]
	},
	addOne: (key: string): void | null => {
		storage.add(key, 1)
	},
	removeOne: (key: string): void | null => {
		storage.add(key, -1)
	}
}

export default storage
