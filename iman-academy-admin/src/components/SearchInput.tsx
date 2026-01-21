import { SearchIcon } from './icons/SearchIcon'

export const SearchInput = () => {
	return (
		<div className='relative w-[293px]'>
			<input
				type='search'
				placeholder='Поиск курсов, уроков, студентов....'
				className='border border-[#ADADAD] py-2 pl-10 pr-[9px] rounded-lg w-full bg-transparent placeholder:text-sm placeholder:text-[#71717A]'
			/>
			<SearchIcon className='absolute top-1/2 -translate-y-1/2 left-[12px] w-5 h-5' />
		</div>
	)
}
