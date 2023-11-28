'use client'

import { useFormState, useFormStatus } from 'react-dom'

import { authenticate } from './actions'

export default function LoginPage() {
	const [state, dispatch] = useFormState(authenticate, undefined)

	const { pending } = useFormStatus()

	return (
		<form
			action={dispatch}
			className='bg-slate-100 h-screen w-screen flex flex-col gap-10 items-center justify-center'
		>
			<div className='flex flex-col gap-5'>
				<label>Username</label>
				<input
					className='p-4 rounded-md'
					id='username'
					type='username'
					name='username'
					placeholder='mr_nobody'
				/>
				<label>Password</label>
				<input
					className='p-4 rounded-md'
					id='password'
					type='password'
					name='password'
					placeholder='someterriblepassword'
				/>
			</div>

			<input
				className='bg-green-500 flex items-end px-4 py-2 rounded-md hover:bg-green-600 hover:cursor-pointer'
				type='submit'
				aria-disabled={pending}
				value='Submit'
			/>
		</form>
	)
}
