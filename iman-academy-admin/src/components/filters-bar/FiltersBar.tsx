type FiltersBarProps = {
	children: React.ReactNode
}

export const FiltersBar = ({ children }: FiltersBarProps) => {
	return (
		<div className='rounded-lg p-5 border border-color_border_light bg-color_bg_white'>
			<div className='flex items-center flex-wrap gap-5'>{children}</div>
		</div>
	)
}
