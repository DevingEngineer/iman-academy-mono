import MainLayout from '@/src/layouts/MainLayout'
import { CoursesStats } from '@/src/modules/courses-stats'
import { DashboardHeader } from '@/src/modules/dashboard-header'

const CoursesPage = () => {
	return (
		<MainLayout>
			<DashboardHeader />
			<CoursesStats />
		</MainLayout>
	)
}

export default CoursesPage
