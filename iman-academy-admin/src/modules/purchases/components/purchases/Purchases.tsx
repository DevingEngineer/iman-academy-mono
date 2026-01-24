import { PurchasesBulkActions } from '../purchases-bulk-actions/PurchasesBulkActions'
import { PurchasesFilters } from '../purchases-filters/PurchasesFilters'

export const Purchases = () => {
	return (
		<section>
			<PurchasesFilters />
			<PurchasesBulkActions />
		</section>
	)
}
