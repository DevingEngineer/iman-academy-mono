import { redirect } from 'next/navigation'

type LegacyEditSubmodulePageProps = {
	params: Promise<{ subModuleId: string }>
}

const LegacyEditSubmodulePage = async ({ params }: LegacyEditSubmodulePageProps) => {
	const { subModuleId } = await params
	redirect(`/edit-lesson/${subModuleId}/step/1`)
}

export default LegacyEditSubmodulePage
