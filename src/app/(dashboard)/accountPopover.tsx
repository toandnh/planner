import Link from 'next/link'

import { Popover } from '@headlessui/react'

import AccountBoxIcon from '@mui/icons-material/AccountBox'

import { logout } from '../(auth)/login/actions'

export default function AccountPopover() {
	let content = (
		<div className='w-full flex flex-col items-center p-4'>
			<Popover.Button
				as={Link}
				href='/profile'
				className='w-full h-full flex justify-center p-4 rounded-md hover:cursor-pointer hover:bg-rose-200 hover:dark:bg-rose-300'
			>
				Profile
			</Popover.Button>
			<span className='bg-pink-300/70 w-full h-[1px]'></span>
			<input
				type='button'
				onClick={async () => {
					await logout()
				}}
				className='w-full h-full p-4 rounded-md hover:cursor-pointer hover:bg-rose-200 hover:dark:bg-rose-300'
				value='Sign out'
			/>
		</div>
	)

	return (
		<Popover className='relative z-10'>
			{({ open }) => (
				<>
					<Popover.Button>
						<AccountBoxIcon fontSize='large' sx={{ color: '#000' }} />
					</Popover.Button>
					{open && (
						<Popover.Panel className='absolute left-full w-screen max-w-xs -translate-x-full transform px-4 sm:px-0 mt-3'>
							<div className='bg-rose-200 dark:bg-rose-200 flex flex-col justify-center items-center rounded-md overflow-hidden'>
								{content}
							</div>
						</Popover.Panel>
					)}
				</>
			)}
		</Popover>
	)
}
