'use client'

import { useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import {
	addInSearchResults,
	clearInSearchResults,
	clearedSearchQuery,
	setClearedSearchQuery
} from '@/lib/features/todos/todosSlice'

import TodosSearchResults from './todosSearchResults'

export default function TodosSearch({
	userId,
	data
}: {
	userId: string
	data: TodoDatum[]
}) {
	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState<TodoDatum[]>([])

	const queryCleared = useAppSelector(clearedSearchQuery)

	const dispatch = useAppDispatch()

	const hasSubString = (str: string, subStr: string) => {
		// Return true if subStr matches the first letters of any word in the string
		let strArr = str.split(' ')
		let subStrLen = subStr.length
		for (let word of strArr) {
			if (word.toLowerCase().substring(0, subStrLen) == subStr) return true
		}
		return false
	}

	useEffect(() => {
		if (queryCleared) {
			setSearchQuery('')
			dispatch(setClearedSearchQuery(false))
		}
	}, [queryCleared])

	useEffect(() => {
		if (searchQuery) {
			let updatedSearchResults: TodoDatum[] = []
			let possibleSearchedTaskNames: string[] = []
			data.map((datum: TodoDatum) => {
				if (hasSubString(datum.task!, searchQuery)) {
					updatedSearchResults.push(datum)
					possibleSearchedTaskNames.push(datum.task!)
				}
			})
			setSearchResults(updatedSearchResults)
			dispatch(addInSearchResults(possibleSearchedTaskNames))
		} else {
			dispatch(clearInSearchResults())
		}
	}, [searchQuery])

	const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
	}

	return (
		<div className='w-full flex flex-col gap-2'>
			<div className='w-full flex gap-2'>
				<input
					className='w-full rounded-md p-2'
					type='text'
					name='search'
					value={searchQuery}
					onChange={handleSearchQueryChange}
					placeholder='Touch grass'
				/>
			</div>
			{searchQuery && (
				<TodosSearchResults
					userId={userId}
					searchQuery={searchQuery}
					searchResults={searchResults}
				/>
			)}
		</div>
	)
}
