type FooterShapeProps = React.SVGProps<SVGSVGElement>

export const FooterShape = (props: FooterShapeProps) => {
	return (
		<svg
			{...props}
			viewBox='0 0 1512 318'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M0 0L1512 0V191.389C1512 191.389 1162.02 318 822 318C481.979 318 0 191.389 0 191.389V0Z'
				fill='url(#paint0_linear_2001_2549)'
			/>
			<defs>
				<linearGradient
					id='paint0_linear_2001_2549'
					x1='0'
					y1='159'
					x2='1512'
					y2='159'
					gradientUnits='userSpaceOnUse'
				>
					<stop stopColor='#091E3A' />
					<stop offset='0.5' stopColor='#2F80ED' />
					<stop offset='1' stopColor='#2D9EE0' />
				</linearGradient>
			</defs>
		</svg>
	)
}
