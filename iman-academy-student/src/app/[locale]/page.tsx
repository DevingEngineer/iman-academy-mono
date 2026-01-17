import { CoursesStats } from '@/src/modules/courses-stats'
import { DashboardHeader } from '@/src/modules/dashboard-header'
import MainLayout from '../../layouts/MainLayout'

const HomePage = () => {
	return (
		<MainLayout>
			<DashboardHeader />
			<CoursesStats />
		</MainLayout>
	)
}

export default HomePage
