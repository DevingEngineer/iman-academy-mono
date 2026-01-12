import { SectionTitle } from '@/src/components/UI/SectionTitle'
import { StepCards } from '../step-cards/StepCards'
import { TeachingGallery } from '../teaching-gallery/TeachingGallery'

export const WhatWeTeach = () => {
	return (
		<section className='pt-[36px] pb-[76px] w750:pt-[40px] w750:pb-5'>
			<SectionTitle title='Кто будет преподавать' />
			<h2 className='h1 mt-5'>
				Соединяем классические источники, опыт устазов и современные форматы
				обучения чтобы знания переходили в практику и поклонение.
			</h2>
			<div className='mt-8 grid grid-cols-2 gap-6 w1150:flex w1150:flex-col-reverse'>
				<StepCards />
				<TeachingGallery />
			</div>
		</section>
	)
}
