'use client'

import { useSearchParams } from 'next/navigation'

import Todo from './todo'
import HealthHome from './health'
import Calendar from './calendar'
import SpendingHome from './spending'

export default function TabHome() {
	const searchParams = useSearchParams()
	const tab = searchParams.get('tab')

	let content = <Todo />
	if (tab === 'health') {
		content = <HealthHome />
	} else if (tab === 'calendar') {
		content = <Calendar />
	} else if (tab === 'spending') {
		content = <SpendingHome />
	}

	return content
}
