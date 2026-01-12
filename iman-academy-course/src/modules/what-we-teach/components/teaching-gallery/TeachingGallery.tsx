import Image from 'next/image'

export const TeachingGallery = () => {
	return (
		<div className='bg-system_surface_card rounded-3xl flex justify-between flex-col w-fit m-auto'>
			<div className='flex justify-center gap-5 w450:gap-2'>
				<Image
					src='https://placehold.co/236x176/png'
					alt=''
					width={236}
					height={176}
					className='rounded-2xl object-cover'
				/>
				<Image
					src='https://placehold.co/236x176/png'
					alt=''
					width={236}
					height={176}
					className='rounded-2xl object-cover'
				/>
			</div>
			<div className='flex jusyify-center mt-4 gap-5 m-auto w450:gap-2'>
				<Image
					src='https://placehold.co/215x176/png'
					alt=''
					width={215}
					height={176}
					className='rounded-2xl object-cover'
				/>
				<Image
					src='https://placehold.co/215x176/png'
					alt=''
					width={215}
					height={176}
					className='rounded-2xl object-cover'
				/>
				<Image
					src='https://placehold.co/215x176/png'
					alt=''
					width={215}
					height={176}
					className='rounded-2xl object-cover w450:hidden'
				/>
			</div>
			<div className='flex justify-center gap-5 mt-4 w450:gap-2'>
				<Image
					src='https://placehold.co/236x176/png'
					alt=''
					width={236}
					height={176}
					className='rounded-2xl object-cover'
				/>
				<Image
					src='https://placehold.co/236x176/png'
					alt=''
					width={236}
					height={176}
					className='rounded-2xl object-cover'
				/>
			</div>
		</div>
	)
}
