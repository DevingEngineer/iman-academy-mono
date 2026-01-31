import { FiltersBar } from '@/src/components/filters-bar/FiltersBar'
import { FiltersGroup } from '@/src/components/filters-bar/FiltersGroup'
import { FiltersSearch } from '@/src/components/filters-bar/FiltersSearch'
import { FiltersSelect } from '@/src/components/filters-bar/FiltersSelect'

export const PurchasesFilters = () => {
	return (
		<FiltersBar>
			<FiltersSearch placeholder='Поиск: по имени или email' />

			<FiltersGroup>
				<FiltersSelect label='Курсы' />
				<FiltersSelect label='Уровень' />
				<FiltersSelect label='Язык' />
				<FiltersSelect label='Статус' />
			</FiltersGroup>
		</FiltersBar>
	)
}
