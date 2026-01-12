import { Hero } from '@/src/components/Hero'
import { AreasStudy } from '@/src/modules/areas-study'
import { ConsultationSection } from '@/src/modules/consultation-section'
import { Teachers } from '@/src/modules/teachers'

const HomePage = () => {
	return (
		<main className='container'>
			<Hero />
			<AreasStudy />
			<Teachers />
			<ConsultationSection />
		</main>
	)
}

export default HomePage
