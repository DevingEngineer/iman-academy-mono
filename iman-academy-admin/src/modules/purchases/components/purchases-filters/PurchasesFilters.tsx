'use client'
import { useState } from 'react'
import { FiltersBar } from '@/src/components/filters-bar/FiltersBar'
import { FiltersGroup } from '@/src/components/filters-bar/FiltersGroup'
import { FiltersSearch } from '@/src/components/filters-bar/FiltersSearch'
import { FiltersSelect } from '@/src/components/filters-bar/FiltersSelect'

export const PurchasesFilters = () => {
	const [search, setSearch] = useState('')
	return (
		<FiltersBar>
			<FiltersSearch placeholder='Поиск: по имени или email' 
				value={search} 
                onChange={(str) => setSearch(str)}
				/>

			<FiltersGroup>
				<FiltersSelect label='Курсы' />
				<FiltersSelect label='Уровень' />
				<FiltersSelect label='Язык' />
				<FiltersSelect label='Статус' />
			</FiltersGroup>
		</FiltersBar>
	)
}
