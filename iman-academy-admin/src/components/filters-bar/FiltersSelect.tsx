import { FilterIcon } from '../icons/FilterIcon'

type FiltersSelectProps = {
	label: string
	onClick?: () => void
}

export const FiltersSelect = ({ label, onClick }: FiltersSelectProps) => {
	return (
		<button
			onClick={onClick}
			className='flex flex-1 h-8 items-center gap-2 rounded-lg border border-color_border_light px-4 text-sm'
		>
			<FilterIcon /> {label}
		</button>
	)
}
