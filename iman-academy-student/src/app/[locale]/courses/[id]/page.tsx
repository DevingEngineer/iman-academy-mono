import { Header } from '@/src/components/header/Header'
import { CoursePlayer } from '@/src/modules/course-player'
import { CoursesStats } from '@/src/modules/courses-stats'
import { StudentProfileHeader } from '@/src/modules/student-profile-header'

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

const CoursePage = async ({ params }: PageProps) => {
	
	const { courseId } = await params; 

	return (
		<>
			<Header />
			<main className='container'>
				<StudentProfileHeader />
				<CoursesStats />
				{/* 3. Pass the parameter down if needed */}
				<CoursePlayer courseId={courseId} />
			</main>
		</>
	)
}

export default CoursePage
