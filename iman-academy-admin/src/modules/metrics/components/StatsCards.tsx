import { ArrowDown } from '../icons/ArrowDown'
import { ArrowUp } from '../icons/ArrowUp'
import { StatsCard } from './StatsCard'

const stats = [
	{
		title: 'Продажи (7 дней)',
		value: '128 500 c',
		change: '+12.4%',
		icon: ArrowUp,
	},
	{
		title: 'Активные студенты (24ч)',
		value: '214',
		change: '-3.9%',
		icon: ArrowDown,
	},
	{
		title: 'Завершение уроков (24ч)',
		value: '15k',
		change: '+6.1%',
		icon: ArrowUp,
	},
	{
		title: 'Новые регистрации (7 дней',
		value: '96',
		change: '+2.1%',
		icon: ArrowUp,
	},
]

export const StatsCards = () => {
	return (
		<div className='grid grid-cols-4 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
			{stats.map((item) => (
				<StatsCard key={item.title} {...item} />
			))}
		</div>
	)
}
