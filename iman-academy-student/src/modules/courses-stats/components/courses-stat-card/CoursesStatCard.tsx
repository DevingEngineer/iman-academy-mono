import { Link } from '@/src/i18n/navigation'

type CoursesStatCardProps = {
	title: string
	value: number | string
	icon: React.FC
	href?: string
}

export const CoursesStatCard = ({
	icon: Icon,
	title,
	value,
	href,
}: CoursesStatCardProps) => {
	const content = (
		<div className='bg-white flex gap-4 border border-border_devider rounded-xl p-5'>
			<Icon />
			<div>
				<span className='body1 text-secondary_text !font-normal'>
					{title}
				</span>
				<h4 className='h4 text-primary_text'>{value}</h4>
			</div>
		</div>
	)

	return href ? (
		<Link href={href} className='block rounded-xl transition-shadow hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-system_info'>
			{content}
		</Link>
	) : content
}
