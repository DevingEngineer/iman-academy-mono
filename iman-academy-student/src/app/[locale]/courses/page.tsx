import MainLayout from '@/src/layouts/MainLayout'
import { CoursesStats } from '@/src/modules/courses-stats'
import { StudentProfileHeader } from '@/src/modules/student-profile-header'

const CoursesPage = () => {
	return (
		<MainLayout>
			<StudentProfileHeader />
			<CoursesStats />
		</MainLayout>
	)
}

export default CoursesPage
