import { Header } from '@/src/components/header/Header'
import { CoursePlayer } from '@/src/modules/course-player'
import { CoursesStats } from '@/src/modules/courses-stats'
import { DashboardHeader } from '@/src/modules/dashboard-header'

const CoursePage = () => {
	return (
		<>
			<Header />
			<main className='container'>
				<DashboardHeader />
				<CoursesStats />
				<CoursePlayer />
			</main>
		</>
	)
}

export default CoursePage
