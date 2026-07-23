import { Header } from '@/src/components/header/Header'
import { CoursePlayer } from '@/src/modules/course-player'
import { CoursesStats } from '@/src/modules/courses-stats'
import { StudentProfileHeader } from '@/src/modules/student-profile-header'

const CoursePage = () => {
	return (
		<>
			<Header />
			<main className='container'>
				<StudentProfileHeader />
				<CoursesStats />
				<CoursePlayer />
			</main>
		</>
	)
}

export default CoursePage
