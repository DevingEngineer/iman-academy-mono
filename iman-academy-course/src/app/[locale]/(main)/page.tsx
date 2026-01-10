import { Hero } from '@/src/components/Hero'
import { AreasStudy } from '@/src/modules/areas-study'
import { ConsultationSection } from '@/src/modules/consultation-section'

const HomePage = () => {
	return (
		<main className='container'>
			<Hero />
			<AreasStudy />
			<ConsultationSection />
		</main>
	)
}

export default HomePage
