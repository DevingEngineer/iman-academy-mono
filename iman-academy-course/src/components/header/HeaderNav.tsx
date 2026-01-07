import { Link } from '@/src/i18n/navigation'

const HEADER_NAV_LINKS = [
	{
		path: '/directions',
		label: 'Направления',
	},
	{
		path: '/courses',
		label: 'Курсы',
	},
	{
		path: '/how-we-teach',
		label: 'Как учим?',
	},
	{
		path: '/questions',
		label: 'Вопросы',
	},
]

export const HeaderNav = () => {
	return (
		<ul className='w750:hidden max-w-[440px] w-full flex items-center justify-between text-white'>
			{HEADER_NAV_LINKS.map((l) => (
				<li
					key={l.label}
					className='relative button-label before:absolute before:w-0 before:h-[1px] before:bottom-0 before:bg-current hover:before:w-full before:duration-200'
				>
					<Link href={l.path}>{l.label}</Link>
				</li>
			))}
		</ul>
	)
}
