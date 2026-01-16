import { Link } from '../i18n/navigation'

const NAV_ITEMS = [
	{
		label: 'Главная',
		path: '',
	},
	{
		label: 'Уроки',
		path: '',
	},
	{
		label: 'Тестирования',
		path: '',
	},
	{
		label: 'Сертификаты',
		path: '',
	},
	{
		label: 'Оплата и доступ',
		path: '',
	},
] as const

export const DashboardNav = () => {
	return (
		<ul className='flex flex-wrap gap-5 items-center max-w-[1035px] w-full justify-between py-[26px]'>
			{NAV_ITEMS.map((item) => (
				<li key={item.label}>
					<Link
						href={item.path}
						className='text-primary_text rounded-full py-[18px] px-[43px] border border-border_devider flex'
					>
						{item.label}
					</Link>
				</li>
			))}
		</ul>
	)
}
