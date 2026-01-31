type StatsCardProps = {
	title: string
	icon: React.FC
	change: string
	value: string | number
}

export const StatsCard = ({
	icon: Icon,
	title,
	value,
	change,
}: StatsCardProps) => {
	return (
		<div
			key={title}
			className='shadow-[0_1px_3px_1px_rgba(0,0,0,0.15),_0_1px_2px_0_rgba(0,0,0,0.30)] rounded-lg border border-color_border_light bg-color_bg_white p-4'
		>
			<p className='body text-color_text_secondary'>{title}</p>
			<span className='headline-section block my-2'>{value}</span>
			<span className='text-sm flex items-center gap-2'>
				{<Icon />}
				{change}
			</span>
		</div>
	)
}
