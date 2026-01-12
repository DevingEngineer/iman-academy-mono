import { Hero } from '@/src/components/Hero'
import { AreasStudy } from '@/src/modules/areas-study'
import { ConsultationSection } from '@/src/modules/consultation-section'
import { FindStep } from '@/src/modules/find-step'
import { Teachers } from '@/src/modules/teachers'
import { WhatWeTeach } from '@/src/modules/what-we-teach'

const HomePage = () => {
	return (
		<main className='container'>
			<Hero />
			<AreasStudy />
			<WhatWeTeach />
			<FindStep />
			<Teachers />
			<ConsultationSection />
		</main>
	)
}

export default HomePage
