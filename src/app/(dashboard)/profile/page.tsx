import TabsProfile from './tabs'

export default function ProfilePage() {
	return (
		<div className='bg-slate-100 min-h-[80vh] h-[100vh] p-20 mt-10'>
			<div className='flex justify-center pb-5'>
				<h2 className='text-xl font-semibold'>Amy Dinh</h2>
			</div>

			<TabsProfile />
		</div>
	)
}
