import { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useState } from 'react'

export function useAnimationTimer(
	duration: number
): [boolean, Dispatch<SetStateAction<boolean>>] {
	const [inEffect, setInEffect] = useState(false)

	useEffect(() => {
		setInterval(() => {
			setInEffect(false)
		}, duration)
	}, [inEffect])

	return [inEffect, setInEffect]
}

export function useMediaQuery(width: number): boolean {
	const [targetReached, setTargetReached] = useState(false)

	const updateTarget = useCallback((e: MediaQueryListEvent) => {
		if (e.matches) {
			setTargetReached(true)
		} else {
			setTargetReached(false)
		}
	}, [])

	useEffect(() => {
		const media = window.matchMedia(`(max-width: ${width}px)`)
		media.addEventListener('change', (e) => updateTarget(e))

		// Check on mount (callback is not called until a change occurs)
		if (media.matches) {
			setTargetReached(true)
		}

		return () => media.removeEventListener('change', (e) => updateTarget(e))
	}, [])

	return targetReached
}

export function useMountTransition(
	isMounted: boolean,
	unmountDelay: number
): boolean {
	const [hasTransitionedIn, setHasTransitionedIn] = useState(false)

	useEffect(() => {
		let timeoutId: string | number | NodeJS.Timeout | undefined

		if (isMounted && !hasTransitionedIn) {
			setHasTransitionedIn(true)
		} else if (!isMounted && hasTransitionedIn) {
			timeoutId = setTimeout(() => setHasTransitionedIn(false), unmountDelay)
		}

		return () => {
			clearTimeout(timeoutId)
		}
	}, [unmountDelay, isMounted, hasTransitionedIn])

	return hasTransitionedIn
}

export function useScreenSize(): { width: number; height: number } {
	const [screenSize, setScreenSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight
	})

	useEffect(() => {
		const handleResize = () => {
			setScreenSize({
				width: window.innerWidth,
				height: window.innerHeight
			})
		}

		window.addEventListener('resize', handleResize)

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return screenSize
}

export function useToggle(
	initialValue?: boolean
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
	const [value, setValue] = useState(!!initialValue)

	const toggle = useCallback(() => {
		setValue((v) => !v)
	}, [])

	return [value, toggle, setValue]
}
