import { CourseLayoutClient } from '@/src/components/CourseLayoutClient'

type CourseLayoutProps = {
	children: React.ReactNode
	params: Promise<{ slug: string }>
}

const CourseLayout = async ({ children, params }: CourseLayoutProps) => {
	const { slug } = await params

	return <CourseLayoutClient courseSlug={slug}>{children}</CourseLayoutClient>
}

export default CourseLayout
