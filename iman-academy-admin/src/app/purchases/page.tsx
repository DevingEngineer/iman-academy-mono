import { PageHeader } from '@/src/components/ui/PageHeader'
import { Purchases } from '@/src/modules/purchases'

const PurchasesPage = () => {
	return (
		<>
			<PageHeader
				title='Транзакции и оплаты'
				description='Статусы платежей, источники, методы, экспорт CSV и быстрые операции.'
			/>
			<Purchases />
		</>
	)
}

export default PurchasesPage
