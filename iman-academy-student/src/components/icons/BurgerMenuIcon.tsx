type BurgerMenuIconProps = React.SVGProps<SVGSVGElement>

export const BurgerMenuIcon = (props: BurgerMenuIconProps) => {
	return (
		<svg
			{...props}
			width='13'
			height='9'
			viewBox='0 0 13 9'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M0.5 0.5H12.5M0.5 4.5H12.5M0.5 8.5H12.5'
				stroke='white'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
