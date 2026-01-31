import { FiltersBar } from '@/src/components/filters-bar/FiltersBar'
import { FiltersGroup } from '@/src/components/filters-bar/FiltersGroup'
import { FiltersSearch } from '@/src/components/filters-bar/FiltersSearch'
import { FiltersSelect } from '@/src/components/filters-bar/FiltersSelect'

export const FeedbackFilters = () => {
	return (
		<FiltersBar>
			<FiltersSearch placeholder='Поиск: по студенту, курсу или уроку' />

			<FiltersGroup>
				<FiltersSelect label='Категории' />
				<FiltersSelect label='Статус' />
			</FiltersGroup>
		</FiltersBar>
	)
}
