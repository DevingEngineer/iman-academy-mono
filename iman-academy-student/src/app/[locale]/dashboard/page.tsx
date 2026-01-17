import { DashboardNav } from '@/src/components/DashboardNav'
import { Footer } from '@/src/components/footer/Footer'
import { Certificates } from '@/src/modules/certificates'
import { DashboardHeader } from '@/src/modules/dashboard-header'
import { MyCourses } from '@/src/modules/my-courses'

const DashboardPage = () => {
	return (
		<>
			<DashboardHeader />
			<main className='container'>
				<DashboardNav />
				<MyCourses />
				<Certificates />
			</main>
			<Footer />
		</>
	)
}

export default DashboardPage
