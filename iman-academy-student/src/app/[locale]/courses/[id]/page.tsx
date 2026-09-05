import MainLayout from '@/src/layouts/MainLayout'
import { CoursePreview } from '@/src/modules/course-preview'
import { StudentProfileHeader } from '@/src/modules/student-profile-header'

interface PageProps {
	params: Promise<{
		id: string
	}>
}

const CoursePage = async ({ params }: PageProps) => {
	const { id } = await params

	return (
		<MainLayout>
				<StudentProfileHeader />
				<CoursePreview courseId={id} />
		</MainLayout>
	)
}

export default CoursePage
