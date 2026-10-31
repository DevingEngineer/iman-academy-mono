import { CourseSettings } from '@/src/components/courses/CourseSettings'

type CourseSettingsPageProps = {
	params: Promise<{ slug: string }>
}

const CourseSettingsPage = async ({ params }: CourseSettingsPageProps) => {
	const { slug } = await params

	return <CourseSettings courseSlug={slug} />
}

export default CourseSettingsPage
