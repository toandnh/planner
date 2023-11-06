'use client'

import { useSearchParams } from 'next/navigation'

import HealthProfile from './health'
import SpendingProfile from './spending'

export default function Tab() {
	const searchParams = useSearchParams()
	const tab = searchParams.get('tab')

	const content = (
		<div className='h-full w-full border-2'>
			{tab === 'spending' ? <SpendingProfile /> : <HealthProfile />}
		</div>
	)

	return content
}
