import { Dispatch, SetStateAction, useCallback, useState } from 'react'

export function useToggle(
	initialValue?: boolean
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
	const [value, setValue] = useState(!!initialValue)
	const toggle = useCallback(() => {
		setValue((v) => !v)
	}, [])
	return [value, toggle, setValue]
}
