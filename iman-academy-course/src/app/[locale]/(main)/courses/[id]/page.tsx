import { CourseDetails } from '@/src/modules/course-details'
import { Programs } from '@/src/modules/programs'
import { WhoWillTeach } from '@/src/modules/who-will-teach'

const CourseDetailsPage = () => {
	return (
		<main>
			<CourseDetails />
			<WhoWillTeach />
			<Programs />
		</main>
	)
}

export default CourseDetailsPage
