import { cn } from '@/src/lib/cn'
import { getVisiblePages } from '@/src/utils/paginationUtils'
import { DoubleArrow } from './DoubleArrow'
import { SingleArrow } from './SingleArrow'

type PaginationProps = {
	page: number
	totalPages: number
	onPageChange: (page: number) => void
}

export function Pagination({
	page,
	totalPages,
	onPageChange,
}: PaginationProps) {
	const pages = getVisiblePages(page, totalPages)

	return (
		<nav className='flex gap-2 items-center justify-center border border-border_devider rounded-lg'>
			<button
				className='w-10 h-10 body !font-semibold flex justify-center items-center transform rotate-180 cursor-pointer'
				onClick={() => onPageChange(1)}
				disabled={page === 1}
			>
				<DoubleArrow />
			</button>

			<button
				className='w-10 h-10 body !font-semibold flex justify-center items-center transform rotate-180 cursor-pointer'
				onClick={() => onPageChange(page - 1)}
				disabled={page === 1}
			>
				<SingleArrow />
			</button>

			{pages.map((p) => (
				<button
					className={cn(
						'w-10 h-10 body flex justify-center items-center cursor-pointer rounded-lg',
						p === page && 'bg-primary_brand text-white'
					)}
					key={p}
					onClick={() => onPageChange(p)}
				>
					{p}
				</button>
			))}

			<button
				className='w-10 h-10 body !font-semibold flex justify-center items-center cursor-pointer'
				onClick={() => onPageChange(page + 1)}
				disabled={page === totalPages}
			>
				<SingleArrow />
			</button>

			<button
				className='w-10 h-10 body !font-semibold flex justify-center items-center cursor-pointer'
				onClick={() => onPageChange(totalPages)}
				disabled={page === totalPages}
			>
				<DoubleArrow />
			</button>
		</nav>
	)
}
