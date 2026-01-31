type PageHeaderProps = {
	title: string
	description: string
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
	return (
		<section className='mb-5'>
			<h1 className='text-xl font-semibold leading-[100%]'>{title}</h1>
			<p className='mt-2 text-color_text_secondary leading-[100%]'>
				{description}
			</p>
		</section>
	)
}
