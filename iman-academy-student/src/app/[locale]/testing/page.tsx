import { Footer } from '@/src/components/footer/Footer'
import { Header } from '@/src/components/header/Header'
import { CoursesStats } from '@/src/modules/courses-stats'
import { StudentProfileHeader } from '@/src/modules/student-profile-header'
import { TestPassing } from '@/src/modules/test-passing'

const TestingPage = () => {
	return (
		<>
			<Header />
			<main className='container'>
				<StudentProfileHeader />
				<CoursesStats />
				<TestPassing />
			</main>
			<Footer />
		</>
	)
}

export default TestingPage
