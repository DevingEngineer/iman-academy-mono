import { PurchasesBulkActions } from '../purchases-bulk-actions/PurchasesBulkActions'
import { PurchasesFilters } from '../purchases-filters/PurchasesFilters'
import { PurchasesPagination } from '../purchases-pagination/PurchasesPagination'

export const Purchases = () => {
	return (
		<section>
			<PurchasesFilters />
			<PurchasesBulkActions />
			<PurchasesPagination />
		</section>
	)
}
