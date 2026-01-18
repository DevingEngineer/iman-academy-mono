import { Navigation } from '@/src/components/Navigation'
import { Footer } from '@/src/components/footer/Footer'
import { Certificates } from '@/src/modules/certificates'
import { CoursesStats } from '@/src/modules/courses-stats'
import { MyCourses } from '@/src/modules/my-courses'
import { StudentProfileHeader } from '@/src/modules/student-profile-header'

const HomePage = () => {
	return (
		<>
			<main className='container'>
				<StudentProfileHeader />
				<Navigation />
				<CoursesStats />
				<MyCourses />
				<Certificates />
			</main>
			<Footer />
		</>
	)
}

export default HomePage
