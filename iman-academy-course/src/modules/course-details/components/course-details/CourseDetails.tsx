import { Button } from '@/src/components/UI/Button'
import { CourseVideoBlock } from '../course-video-block/CourseVideoBlock'

export const CourseDetails = () => {
	return (
		<section className='container'>
			<div className='bg-system_surface_card pt-3 pb-[23px] pl-10 pr-[17px] flex justify-between items-center gap-5 rounded-[20px] w1250:flex-col w1250:items-start w1250:pl-[17px]'>
				<div className='flex-1 w1250:max-w-[530px]'>
					<div className='flex gap-2 items-center flex-wrap'>
						<div className='px-3 py-2 bg-background_light flex justify-center items-center rounded-[20px] body2 !font-normal text-secondary_text'>
							<span>Для любого уровня</span>
						</div>
						<div className='px-3 py-2 bg-background_light flex justify-center items-center rounded-[20px] body2 !font-normal text-secondary_text'>
							<span>7 недель</span>
						</div>
						<div className='px-3 py-2 bg-background_light flex justify-center items-center rounded-[20px] body2 !font-normal text-secondary_text'>
							<span>С устазом онлайн</span>
						</div>
					</div>
					<h3 className='h3 mt-6'>
						Основы акыды. Понимание вероубеждения с ясностью и
						уверенностью.
					</h3>
					<ul className='flex flex-col gap-1 list-disc mt-[20px] body1 !font-normal'>
						<li>
							Узнаете, что такое иман и таухид в классическом смысле.
						</li>
						<li>Разберёте виды ширк и ошибки в убеждениях.</li>
						<li>Поймёте разницу между верой, словом и действием.</li>
						<li>Научитесь применять знания в ежедневных ситуациях.</li>
					</ul>
					<Button variant='contained' className='px-5 mt-6'>
						Записаться на курс
					</Button>
				</div>
				<CourseVideoBlock
					videoUrl='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
					poster='https://placehold.co/732x528/png'
				/>
			</div>
		</section>
	)
}
