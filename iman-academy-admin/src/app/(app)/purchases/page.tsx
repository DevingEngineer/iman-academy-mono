import { PageHeader } from '@/src/components/ui/PageHeader'
import { Purchases } from '@/src/modules/purchases'
import { EnrollmentActions } from '@/src/modules/purchases/components/enrollment-actions/EnrollmentActions'

const PurchasesPage = () => {
	return (
		<>
			<PageHeader
				title='Транзакции и оплаты'
				description='Статусы платежей, источники, методы, экспорт CSV и быстрые операции.'
			/>
			<Purchases />
			<EnrollmentActions mode='approve' />
		</>
	)
}

export default PurchasesPage
