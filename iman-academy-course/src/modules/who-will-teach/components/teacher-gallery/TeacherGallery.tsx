import Image from 'next/image'

export const TeacherGallery = () => {
	return (
		<div className='h-full grid grid-cols-3 grid-rows-2 gap-1 w550:grid-cols-1'>
			<div className='relative overflow-hidden row-span-2 bg-gray-200 rounded-xl'>
				<Image
					src='https://placehold.co/222x282/png'
					alt='teacher-image'
					width={222}
					height={282}
					className='object-cover h-full w-full'
				/>
			</div>
			<div className='relative overflow-hidden row-span-2 bg-gray-200 rounded-xl'>
				<Image
					src='https://placehold.co/222x282/png'
					alt='teacher-image'
					width={222}
					height={282}
					className='object-cover h-full w-full'
				/>
			</div>
			<div className='bg-gray-200 rounded-xl relative overflow-hidden'>
				<Image
					src='https://placehold.co/222x139/png'
					alt='teacher-image'
					width={222}
					height={139}
					className='object-cover h-full w-full'
				/>
			</div>
			<div className='bg-gray-200 rounded-xl relative overflow-hidden'>
				<Image
					src='https://placehold.co/222x139/png'
					alt='teacher-image'
					width={222}
					height={139}
					className='object-cover h-full w-full'
				/>
			</div>
		</div>
	)
}
