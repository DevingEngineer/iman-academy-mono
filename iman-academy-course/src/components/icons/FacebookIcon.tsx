type FacebookIconProps = React.SVGProps<SVGSVGElement>

export const FacebookIcon = (props: FacebookIconProps) => {
	return (
		<svg
			{...props}
			width='10'
			height='18'
			viewBox='0 0 10 18'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M9.5 0.5H7.04545C5.96048 0.5 4.91994 0.934597 4.15274 1.70818C3.38555 2.48177 2.95455 3.53098 2.95455 4.625V7.1H0.5V10.4H2.95455V17H6.22727V10.4H8.68182L9.5 7.1H6.22727V4.625C6.22727 4.4062 6.31347 4.19636 6.46691 4.04164C6.62035 3.88692 6.82846 3.8 7.04545 3.8H9.5V0.5Z'
				stroke='currentColor'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
