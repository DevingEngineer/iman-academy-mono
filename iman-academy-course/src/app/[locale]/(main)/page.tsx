import { Hero } from '@/src/components/Hero'
import { AreasStudy } from '@/src/modules/areas-study'
import { Consultation } from '@/src/modules/consultation'
import { FindStep } from '@/src/modules/find-step'
import { PopularCourses } from '@/src/modules/popular-courses'
import { Teachers } from '@/src/modules/teachers'
import { WhatWeTeach } from '@/src/modules/what-we-teach'

const HomePage = () => {
	return (
		<>
			<Hero />
			<AreasStudy />
			<WhatWeTeach />
			<FindStep />
			<PopularCourses />
			<Teachers />
			<Consultation />
		</>
	)
}

export default HomePage
