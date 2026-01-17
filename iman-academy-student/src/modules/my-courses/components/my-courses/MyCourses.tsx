import { CoursesStats } from '../courses-stats/CoursesStats'
import { MyCoursesSection } from '../my-courses-section/MyCoursesSection'

export const MyCourses = () => {
	return (
		<section>
			<CoursesStats />
			<MyCoursesSection />
		</section>
	)
}
