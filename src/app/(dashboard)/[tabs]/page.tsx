'use client'

import { useSearchParams } from 'next/navigation'

import Todos from './todos'
import HealthHome from './health'
import Calendar from './calendar'
import SpendingHome from './spending'

export default function TabHome() {
	const searchParams = useSearchParams()
	const tab = searchParams.get('tab')

	let content = <Calendar />
	if (tab === 'todos') {
		content = <Todos />
	} else if (tab === 'health') {
		content = <HealthHome />
	} else if (tab === 'spending') {
		content = <SpendingHome />
	}

	return content
}
