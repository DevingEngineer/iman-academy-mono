type OptionsType = {
	value: string
	label: string
}

const POPOVER_DATA: OptionsType[] = [
	{
		value: 'Курсы',
		label: 'Курсы',
	},
	{
		value: 'Направления',
		label: 'Направления',
	},
	{
		value: 'Курсы',
		label: 'Курсы',
	},
	{
		value: 'Как учим?',
		label: 'Как учим?',
	},
]

type PopoverProps = {
	options?: OptionsType[]
}

export const Popover = ({ options = POPOVER_DATA }: PopoverProps) => {
	return (
		<div className='bg-white absolute min-w-[280px] border border-border_devider rounded-xl overflow-hidden top-14 z-10'>
			<ul className=''>
				{options.map((item, index) => (
					<li
						key={index}
						className='button-label py-[6px] pl-[22px] cursor-pointer border-b border-border_devider hover:bg-border_devider transform duration-200'
					>
						{item.label}
					</li>
				))}
			</ul>
		</div>
	)
}
