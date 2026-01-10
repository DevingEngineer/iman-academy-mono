import Image from 'next/image'
import { Button } from '../Button'

export const CoursesCard = () => {
	return (
		<div className='border border-border_devider rounded-3xl pb-5'>
			<div className='relative rounded-3xl overflow-hidden'>
				<div className='absolute body3 !font-normal top-5 left-5 flex justify-center items-center bg-border_devider py-[5px] px-[12px] rounded-2xl'>
					Для начинающих
				</div>
				<Image
					src='https://placehold.co/438x290/png'
					alt='course-img'
					width={438}
					height={290}
					className='object-cover w-full h-full'
				/>
			</div>
			<div className='pl-6 pr-5 mt-[14px]'>
				<p className='body1 mt-1'>Фыкх поклонения: намаз, пост, закят</p>
				<p className='body1 !font-normal text-secondary_text mt-1'>
					10 недель • Видео + разбор кейсов
				</p>
				<p className='body1 !font-normal text-secondary_text mt-1'>
					Онлайн • Сертификат
				</p>
				<div className='flex justify-between items-center mt-[17px]'>
					<div className='flex justify-center items-center bg-border_devider py-[5px] px-[12px] rounded-2xl'>
						<span className='body1'>1200 сом</span>
					</div>
					<Button variant='contained' className='px-5'>
						Узнать подробно
					</Button>
				</div>
			</div>
		</div>
	)
}
