import { SearchInput } from '../ui/SearchInput'

type FiltersSearchProps = {
	value: string
	placeholder: string
	onChange: (v: string) => void
}

export const FiltersSearch = ({
	value,
	onChange,
	placeholder,
}: FiltersSearchProps) => {
	return (
		<SearchInput
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			className='w-[380px]'
		/>
	)
}
