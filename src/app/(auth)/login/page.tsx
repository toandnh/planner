'use client'

import { useFormState } from 'react-dom'

import { useEffect, useRef, useState } from 'react'

import clsx from 'clsx'

import { authenticate } from './actions'

import Submit from './submit'

import { useAnimationTimer } from '@/hooks/hooks'

export default function LoginPage() {
	const [state, dispatch] = useFormState(authenticate, undefined)

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [displayError, setDisplayError] = useState(false)
	const [canSubmit, setCanSubmit] = useState(false)

	const formRef = useRef<HTMLFormElement>(null)

	const [inEffect, setInEffect] = useAnimationTimer(2000)

	useEffect(() => {
		setCanSubmit(username !== '' && password !== '')
	}, [username, password])

	useEffect(() => {
		// Prevent error from being displayed before first signin attempt
		if (state !== undefined) {
			setDisplayError(true)
			setInEffect(true)
			setUsername('')
			setPassword('')

			formRef.current?.reset()
			formRef.current
				?.querySelectorAll<HTMLElement>('input#username')[0]
				.focus()
		}
	}, [state])

	return (
		<div className='bg-slate-100 h-screen w-screen flex flex-col gap-10 items-center justify-center'>
			<p
				className={clsx(
					'absolute top-20 text-red-500 italic',
					displayError ? '' : 'hidden',
					inEffect ? 'animate-[shake_0.3s_ease-in-out]' : ''
				)}
			>
				Incorrect username or password! Please try again!
			</p>
			<form
				ref={formRef}
				action={dispatch}
				className='relative flex flex-col gap-10 items-center justify-center'
			>
				<Submit
					setUsername={setUsername}
					setPassword={setPassword}
					canSubmit={canSubmit}
				/>
			</form>
		</div>
	)
}
