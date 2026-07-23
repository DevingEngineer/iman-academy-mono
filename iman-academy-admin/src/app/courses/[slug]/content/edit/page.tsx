import { SyllabusEditor } from '@/src/components/SyllabusEditor'

type EditCourseContentPageProps = {
	params: Promise<{ slug: string }>
}

const EditCourseContentPage = async ({ params }: EditCourseContentPageProps) => {
	const { slug } = await params

	return <SyllabusEditor courseSlug={slug} />
}

export default EditCourseContentPage
