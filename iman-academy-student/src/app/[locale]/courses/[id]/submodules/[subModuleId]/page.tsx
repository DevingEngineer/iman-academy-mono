import MainLayout from '@/src/layouts/MainLayout'
import { StudentProfileHeader } from '@/src/modules/student-profile-header'
import { SubmoduleLearning } from '@/src/modules/submodule-learning'

type PageProps = {
	params: Promise<{
		id: string
		subModuleId: string
	}>
}

const SubmodulePage = async ({ params }: PageProps) => {
	const { subModuleId } = await params

	return (
		<MainLayout>
			<StudentProfileHeader />
			<SubmoduleLearning subModuleId={subModuleId} />
		</MainLayout>
	)
}

export default SubmodulePage
