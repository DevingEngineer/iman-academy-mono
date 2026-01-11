type EyeOffProps = React.SVGAttributes<SVGSVGElement>

export const EyeOff = ({ className }: EyeOffProps) => {
	return (
		<svg
			className={className}
			width='12'
			height='12'
			viewBox='0 0 12 12'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M4.92458 4.92575C4.70582 5.14459 4.58296 5.44137 4.58301 5.75079C4.58307 6.06022 4.70604 6.35695 4.92488 6.57571C5.14371 6.79447 5.44049 6.91734 5.74992 6.91728C6.05934 6.91723 6.35607 6.79426 6.57483 6.57542M8.48058 8.47592C7.66231 8.98788 6.71522 9.25637 5.75 9.25C3.65 9.25 1.9 8.08333 0.5 5.75C1.242 4.51333 2.082 3.6045 3.02 3.0235M4.68833 2.355C5.03777 2.28426 5.39347 2.24908 5.75 2.25C7.85 2.25 9.6 3.41667 11 5.75C10.6115 6.3975 10.1956 6.95575 9.75283 7.42417M0.5 0.5L11 11'
				stroke='#10213D'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
