export function getVisiblePages(
	current: number,
	total: number,
	delta = 2
): number[] {
	const pages: number[] = []

	const start = Math.max(1, current - delta)
	const end = Math.min(total, current + delta)

	for (let i = start; i <= end; i++) {
		pages.push(i)
	}

	return pages
}
