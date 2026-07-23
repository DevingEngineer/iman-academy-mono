import { useState } from 'react'

export function usePagination(total: number, pageSize: number) {
	const [page, setPage] = useState(1)

	const totalPages = Math.max(1, Math.ceil(total / pageSize))

	const goToPage = (p: number) => {
		setPage(Math.max(1, Math.min(p, totalPages)))
	}

	return {
		page,
		totalPages,
		goToPage,
		goNext: () => goToPage(page + 1),
		goPrev: () => goToPage(page - 1),
		goFirst: () => goToPage(1),
		goLast: () => goToPage(totalPages),
	}
}
