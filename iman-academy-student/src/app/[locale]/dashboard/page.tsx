import { DashboardNav } from '@/src/components/DashboardNav'
import { Footer } from '@/src/components/footer/Footer'
import { Certificates } from '@/src/modules/certificates'
import { CoursesStats } from '@/src/modules/courses-stats'
import { DashboardHeader } from '@/src/modules/dashboard-header'
import { MyCourses } from '@/src/modules/my-courses'

const DashboardPage = () => {
	return (
		<>
			<main className='container'>
				<DashboardHeader />
				<DashboardNav />
				<CoursesStats />
				<MyCourses />
				<Certificates />
			</main>
			<Footer />
		</>
	)
}

export default DashboardPage
