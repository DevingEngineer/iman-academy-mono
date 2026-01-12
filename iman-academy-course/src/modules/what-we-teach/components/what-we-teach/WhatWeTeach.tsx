import { SectionTitle } from '@/src/components/UI/SectionTitle'
import { StepCards } from '../step-cards/StepCards'
import { TeachingGallery } from '../teaching-gallery/TeachingGallery'

export const WhatWeTeach = () => {
	return (
		<section className='pt-[36px] pb-[76px] w750:pt-[40px] w750:pb-5'>
			<SectionTitle title='Кто будет преподавать' />
			<h2 className='h1 mt-5'>
				Каждый из них передаёт знания с искренностью, опираясь на Книгу
				Аллаха, Сунну Пророка ﷺ и проверенные источники.
			</h2>
			<div className='mt-8 grid grid-cols-2 gap-6 w1150:flex w1150:flex-col-reverse'>
				<StepCards />
				<TeachingGallery />
			</div>
		</section>
	)
}
