import { cn } from '@/src/lib/cn'
import { getVisiblePages } from '@/src/utils/pagination'
import { DoubleArrow } from '../icons/DoubleArrow'
import { SingleArrow } from '../icons/SingleArrow'

type PaginationProps = {
	page: number
	totalPages: number
	onPageChange: (page: number) => void
}

export const Pagination = ({
	page,
	totalPages,
	onPageChange,
}: PaginationProps) => {
	const pages = getVisiblePages(page, totalPages)

	return (
		<div className='max-w-[400px] flex items-center justify-center border border-color_border_light'>
			<button
				className='w-10 h-10 flex justify-center items-center transform rotate-180 cursor-pointer'
				onClick={() => onPageChange(1)}
				disabled={page === 1}
			>
				<DoubleArrow />
			</button>

			<button
				className='w-10 h-10 flex justify-center items-center transform rotate-180 cursor-pointer'
				onClick={() => onPageChange(page - 1)}
				disabled={page === 1}
			>
				<SingleArrow />
			</button>

			{pages.map((p) => (
				<button
					className={cn(
						'w-10 h-10 flex-shrink-0 flex justify-center items-center cursor-pointer leading-[21px]',
						p === page &&
							'bg-primary_brand text-white bg-color_brand_accent font-semibold'
					)}
					key={p}
					onClick={() => onPageChange(p)}
				>
					{p}
				</button>
			))}

			<button
				className='w-10 h-10 flex justify-center items-center cursor-pointer'
				onClick={() => onPageChange(page + 1)}
				disabled={page === totalPages}
			>
				<SingleArrow />
			</button>

			<button
				className='w-10 h-10 flex justify-center items-center cursor-pointer'
				onClick={() => onPageChange(totalPages)}
				disabled={page === totalPages}
			>
				<DoubleArrow />
			</button>
		</div>
	)
}
