type SectionTitleProps = {
	title: string
}

export const SectionTitle = ({ title }: SectionTitleProps) => {
	return (
		<div className='flex gap-[6px] mb-7'>
			<div className='w-[22px] h-[22px] bg-primary_brand rounded' />
			<h4 className='h4 text-primary_brand'>{title}</h4>
		</div>
	)
}
