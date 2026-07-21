import { redirect } from 'next/navigation'

type LegacyEditSubmodulePageProps = {
	params: Promise<{ subModuleId: string }>
}

const LegacyEditSubmodulePage = async ({ params }: LegacyEditSubmodulePageProps) => {
	const { subModuleId } = await params
	redirect(`/courses/edit-lesson/${subModuleId}/step/1`)
}

export default LegacyEditSubmodulePage
