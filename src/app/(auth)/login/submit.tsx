'use client'

import { useEffect, useState } from 'react'

import { useFormStatus } from 'react-dom'

import CircularProgress from '@mui/material/CircularProgress'

export default function Submit({
	setUsername,
	setPassword,
	canSubmit
}: {
	setUsername: Function
	setPassword: Function
	canSubmit: boolean
}) {
	const { pending } = useFormStatus()

	const [disabled, setDisabled] = useState(!canSubmit || pending)

	useEffect(() => {
		setDisabled(!canSubmit || pending)
	}, [canSubmit, pending])

	return (
		<>
			<div key='form-inputs' className='flex flex-col gap-5'>
				<label>Username</label>
				<input
					className='p-4 rounded-md'
					id='username'
					type='username'
					name='username'
					onChange={(e) => setUsername(e.target.value)}
					placeholder='mr_nobody'
				/>
				<label>Password</label>
				<input
					className='p-4 rounded-md'
					id='password'
					type='password'
					name='password'
					onChange={(e) => setPassword(e.target.value)}
					placeholder='someterriblepassword'
				/>
			</div>

			<button
				className='bg-green-300 flex items-center justify-center px-4 py-2 rounded-md hover:bg-green-400 hover:cursor-pointer hover:disabled:bg-green-200 hover:disabled:cursor-default disabled:bg-green-200'
				disabled={disabled}
			>
				<div className='flex items-center gap-5'>
					Submit
					<div
						className={pending ? 'flex justify-center items-center' : 'hidden'}
					>
						<CircularProgress size='1rem' />
					</div>
				</div>
			</button>
		</>
	)
}
