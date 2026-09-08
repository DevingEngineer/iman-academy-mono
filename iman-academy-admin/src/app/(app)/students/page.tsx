import { PageHeader } from '@/src/components/ui/PageHeader'
import { EnrollmentActions } from '@/src/modules/purchases/components/enrollment-actions/EnrollmentActions'

const StudentsPage = () => {
	return (
		<>
			<PageHeader
				title='Список и прогресс'
				description='Поиск, фильтры, доступ к курсам, блокировка/активация и сообщения.'
			/>
			<EnrollmentActions mode='enroll' />
		</>
	)
}

export default StudentsPage
