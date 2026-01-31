import { cn } from '@/src/lib/cn'

export const PeriodButton = ({
	label,
	active = false,
}: {
	label: string
	active?: boolean
}) => {
	return (
		<button
			className={cn(
				'rounded-lg border px-4 py-2 text-sm transition',
				active
					? 'border-gray-400 bg-color_bg_white font-medium shadow'
					: 'border-gray-300 text-gray-700 hover:bg-gray-50'
			)}
		>
			{label}
		</button>
	)
}
