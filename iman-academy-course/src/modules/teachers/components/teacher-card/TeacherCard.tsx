import Image from 'next/image'

export const TeacherCard = () => {
	return (
		<div className='min-w-[320px] border border-border_devider rounded-3xl'>
			<div className='relative rounded-3xl overflow-hidden'>
				<div className='absolute body3 !font-normal top-5 left-5 flex justify-center items-center bg-border_devider py-[5px] px-[12px] rounded-3xl'>
					Команда
				</div>
				<Image
					src='https://placehold.co/320x374/png'
					alt='course-img'
					width={320}
					height={374}
					className='object-cover w-full h-full'
				/>
			</div>
			<div className='px-5 py-[14px]'>
				<h3 className='font-normal text-[19px] leading-[22px]'>
					Устаз Азамат Калыков
				</h3>
				<p className='font-normal text-[14px] leading-[17px] mt-1 text-secondary_text'>
					Преподаватель акыды и фыкха
				</p>
			</div>
		</div>
	)
}
