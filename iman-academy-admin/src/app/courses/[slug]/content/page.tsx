import { CourseSyllabus } from '@/src/components/CourseSyllabus'

type CourseContentPageProps = {
	params: Promise<{ slug: string }>
}

const CourseContentPage = async ({ params }: CourseContentPageProps) => {
	const { slug } = await params

	return <CourseSyllabus courseSlug={slug} />
}

export default CourseContentPage
