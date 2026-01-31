type SingleArrowProps = React.SVGAttributes<SVGSVGElement>

export const SingleArrow = ({ className }: SingleArrowProps) => {
	return (
		<svg
			className={className}
			width='6'
			height='10'
			viewBox='0 0 6 10'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683418 10.0976 1.31658 10.0976 1.70711 9.70711L5.70711 5.70711C6.09763 5.31658 6.09763 4.68342 5.70711 4.29289L1.70711 0.292893C1.31658 -0.0976305 0.683418 -0.0976305 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289Z'
				fill='currentColor'
			/>
		</svg>
	)
}
