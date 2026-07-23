'use client'

import { Pagination } from '@/src/components/ui/Pagination'
import { useState } from 'react'

export const PurchasesPagination = () => {
	const [page, setPage] = useState(1)

	return (
		<div className='mt-5'>
			<Pagination page={page} totalPages={10} onPageChange={setPage} />
		</div>
	)
}
