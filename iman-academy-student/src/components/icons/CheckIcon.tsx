type CheckIconProps = React.SVGAttributes<SVGSVGElement>

export const CheckIcon = ({ className }: CheckIconProps) => {
	return (
		<svg
			className={className}
			width='9'
			height='7'
			viewBox='0 0 9 7'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M1 3.08333L3.08333 5.16667L7.25 1'
				stroke='white'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
