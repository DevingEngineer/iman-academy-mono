import { SearchInput } from '../ui/SearchInput'

type FiltersSearchProps = {
	value: string
	onChange: (v: string) => void
}

export const FiltersSearch = ({ value, onChange }: FiltersSearchProps) => {
	return (
		<SearchInput
			value={value}
			onChange={onChange}
			placeholder='Поиск: по имени или email'
			className='w-[380px]'
		/>
	)
}
