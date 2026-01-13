'use client'

import { ArrowLeft } from '@/src/components/icons/ArrowLeft'
import { SectionTitle } from '@/src/components/UI/SectionTitle'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback } from 'react'
import { TeacherList } from '../teacher-list/TeacherList'

export const Teachers = () => {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: false,
		align: 'center'
	})

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev()
	}, [emblaApi])

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext()
	}, [emblaApi])

	return (
		<section className='pt-[36px] pb-[76px] w750:pt-[40px] w750:pb-5'>
			<div className='container'>
				<div className='flex justify-between items-center w450:flex-col w450:items-start'>
					<SectionTitle title='Кто будет преподавать' />
					<div className='flex items-center justify-center gap-[10px] ml-auto'>
						<button
							onClick={scrollPrev}
							className='text-secondary_text w-10 h-10 border border-secondary_text rounded-full flex justify-center items-center hover:border-system_warning hover:text-system_warning transform transition-all duration-200 cursor-pointer'
						>
							<ArrowLeft />
						</button>
						<button
							onClick={scrollNext}
							className='text-secondary_text w-10 h-10 border border-secondary_text rounded-full flex justify-center items-center hover:border-system_warning hover:text-system_warning transform transition-all duration-200 cursor-pointer rotate-180'
						>
							<ArrowLeft />
						</button>
					</div>
				</div>
				<h2 className='h1 mt-5'>
					Каждый из них передаёт знания с искренностью, опираясь на Книгу
					Аллаха, Сунну Пророка ﷺ и проверенные источники.
				</h2>
				<TeacherList emblaRef={emblaRef} />
			</div>
		</section>
	)
}
