'use client'
import { useState } from 'react'
import { FiltersBar } from '@/src/components/filters-bar/FiltersBar'
import { FiltersGroup } from '@/src/components/filters-bar/FiltersGroup'
import { FiltersSearch } from '@/src/components/filters-bar/FiltersSearch'
import { FiltersSelect } from '@/src/components/filters-bar/FiltersSelect'

export const FeedbackFilters = () => {
	const [search, setSearch] = useState('')
	return (
		<FiltersBar>
			<FiltersSearch placeholder='Поиск: по студенту, курсу или уроку' 
				value={search} 
                onChange={(str) => setSearch(str)}
			/>

			<FiltersGroup>
				<FiltersSelect label='Категории' />
				<FiltersSelect label='Статус' />
			</FiltersGroup>
		</FiltersBar>
	)
}
