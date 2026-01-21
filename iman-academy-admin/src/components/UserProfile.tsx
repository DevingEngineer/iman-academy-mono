import Image from 'next/image'

export const UserProfile = () => {
	return (
		<div className='flex gap-2 items-center'>
			<div className='rounded-full overflow-hidden'>
				<Image
					src='https://placehold.co/40x40.png'
					alt='user-avatar'
					width={40}
					height={40}
				/>
			</div>
			<div className=''>
				<p className='supporting'>Welcome!</p>
				<p className='supporting'>Muhammad Shahryar</p>
			</div>
		</div>
	)
}
