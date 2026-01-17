type CoursesStatCardProps = {
	title: string
	value: number
	icon: React.FC
}

export const CoursesStatCard = ({
	icon: Icon,
	title,
	value,
}: CoursesStatCardProps) => {
	return (
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
}
