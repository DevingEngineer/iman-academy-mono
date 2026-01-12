'use client'

import { SectionTitle } from '@/src/components/UI/SectionTitle'
import { useState } from 'react'
import { ProgramAccordion } from '../program-accordion/ProgramAccordion'

export const Programs = () => {
	const [slideOpen, setSlideOpen] = useState<number>(0)

	return (
		<section className='container py-12 w750:py-5'>
			<SectionTitle title='Программа' />
			<p className='body1 !font-normal mt-2 text-secondary_text'>
				Обучение рассчитано на 8 недель. <br /> Вы будете проходить 1–2
				урока в неделю, выполнять задания и закреплять материал через
				практику и тесты.
			</p>
			<div className='mt-6 flex flex-col gap-6'>
				<ProgramAccordion
					slideOpen={slideOpen}
					setSlideOpen={setSlideOpen}
					value={1}
				/>
				<ProgramAccordion
					slideOpen={slideOpen}
					setSlideOpen={setSlideOpen}
					value={2}
				/>
				<ProgramAccordion
					slideOpen={slideOpen}
					setSlideOpen={setSlideOpen}
					value={3}
				/>
				<ProgramAccordion
					slideOpen={slideOpen}
					setSlideOpen={setSlideOpen}
					value={4}
				/>
			</div>
		</section>
	)
}
