type EmailIconProps = React.SVGAttributes<SVGSVGElement>

export const EmailIcon = ({ className }: EmailIconProps) => {
	return (
		<svg
			className={className}
			width='12'
			height='10'
			viewBox='0 0 12 10'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M0.5 1.66667C0.5 1.35725 0.622916 1.0605 0.841709 0.841709C1.0605 0.622916 1.35725 0.5 1.66667 0.5H9.83333C10.1428 0.5 10.4395 0.622916 10.6583 0.841709C10.8771 1.0605 11 1.35725 11 1.66667M0.5 1.66667V7.5C0.5 7.80942 0.622916 8.10617 0.841709 8.32496C1.0605 8.54375 1.35725 8.66667 1.66667 8.66667H9.83333C10.1428 8.66667 10.4395 8.54375 10.6583 8.32496C10.8771 8.10617 11 7.80942 11 7.5V1.66667M0.5 1.66667L5.75 5.16667L11 1.66667'
				stroke='#10213D'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
