import { CourseOverview } from '@/src/components/CourseOverview'

type CourseOverviewPageProps = {
	params: Promise<{ slug: string }>
}

const CourseOverviewPage = async ({ params }: CourseOverviewPageProps) => {
	const { slug } = await params

	return <CourseOverview courseSlug={slug} />
}

export default CourseOverviewPage
