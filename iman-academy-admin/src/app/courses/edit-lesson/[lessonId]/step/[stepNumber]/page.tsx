import { SubmoduleEditor } from '@/src/components/SubmoduleEditor'

type EditLessonPageProps = {
	params: Promise<{ lessonId: string; stepNumber: string }>
}

const EditLessonPage = async ({ params }: EditLessonPageProps) => {
	const { lessonId, stepNumber } = await params

	return <SubmoduleEditor lessonId={lessonId} stepNumber={stepNumber} />
}

export default EditLessonPage
