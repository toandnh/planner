'use client'

import { useCallback, useEffect, useRef } from 'react'

export default function Modal({
	children,
	toggleModal
}: {
	children: React.ReactNode
	toggleModal: Function
}) {
	const overlay = useRef<HTMLDivElement>(null)
	const wrapper = useRef<HTMLDivElement>(null)

	const onDismiss = useCallback(() => {
		toggleModal()
	}, [toggleModal])

	const onClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (e.target === overlay.current || e.target === wrapper.current) {
				if (onDismiss) onDismiss()
			}
		},
		[onDismiss, overlay, wrapper]
	)

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') onDismiss()
		},
		[onDismiss]
	)

	useEffect(() => {
		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, [onKeyDown])

	return (
		<div
			ref={overlay}
			className='bg-neutral-500/70 fixed left-0 right-0 top-0 bottom-0 p-6 z-20'
			onClick={onClick}
		>
			<div
				ref={wrapper}
				className='relative h-fit w-full flex justify-center items-center sm:w-10/12 md:w-8/12 lg:w-2/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
			>
				{children}
			</div>
		</div>
	)
}
