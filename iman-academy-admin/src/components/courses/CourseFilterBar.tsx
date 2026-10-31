'use client'

import { SearchIcon } from '@/src/components/icons/SearchIcon'
import { XIcon } from '@/src/components/icons/XIcon'
import type { CourseLevel } from '@/src/types/course-types'

type CourseFilterBarProps = {
	searchQuery: string
	onSearchQueryChange: (query: string) => void
	levelFilter: 'all' | CourseLevel
	onLevelFilterChange: (level: 'all' | CourseLevel) => void
	sortBy: 'updated' | 'title' | 'price'
	onSortByChange: (sort: 'updated' | 'title' | 'price') => void
}

export const CourseFilterBar = ({
	searchQuery,
	onSearchQueryChange,
	levelFilter,
	onLevelFilterChange,
	sortBy,
	onSortByChange,
}: CourseFilterBarProps) => {
	return (
		<div className='flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between'>
			<div className='relative flex-1'>
				<SearchIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
				<input
					type='text'
					value={searchQuery}
					onChange={(e) => onSearchQueryChange(e.target.value)}
					placeholder='Поиск по названию, описанию или тегам...'
					className='h-10 w-full rounded-lg border border-slate-200 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-color_brand_primary focus:outline-none'
				/>
				{searchQuery && (
					<button
						onClick={() => onSearchQueryChange('')}
						className='absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600'
					>
						<XIcon className='h-4 w-4' />
					</button>
				)}
			</div>

			<div className='flex flex-wrap items-center gap-2'>
				<select
					value={levelFilter}
					onChange={(e) => onLevelFilterChange(e.target.value as 'all' | CourseLevel)}
					className='h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-color_brand_primary focus:outline-none'
				>
					<option value='all'>Все уровни</option>
					<option value='beginner'>Начинающий</option>
					<option value='intermediate'>Средний</option>
					<option value='advanced'>Продвинутый</option>
				</select>

				<select
					value={sortBy}
					onChange={(e) => onSortByChange(e.target.value as 'updated' | 'title' | 'price')}
					className='h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-color_brand_primary focus:outline-none'
				>
					<option value='updated'>Сначала недавние</option>
					<option value='title'>По названию (А-Я)</option>
					<option value='price'>По стоимости</option>
				</select>
			</div>
		</div>
	)
}