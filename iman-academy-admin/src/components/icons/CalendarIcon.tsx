type CalendarIconProps = React.SVGProps<SVGSVGElement>

export const CalendarIcon = (props: CalendarIconProps) => {
	return (
		<svg
			{...props}
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M10.875 12.375H12.375V17.25M3.75 9H20.25M15.75 6V3M8.25 6V3M5.25 21H18.75C19.1478 21 19.5294 20.842 19.8107 20.5607C20.092 20.2794 20.25 19.8978 20.25 19.5V6C20.25 5.60218 20.092 5.22064 19.8107 4.93934C19.5294 4.65804 19.1478 4.5 18.75 4.5H5.25C4.85218 4.5 4.47064 4.65804 4.18934 4.93934C3.90804 5.22064 3.75 5.60218 3.75 6V19.5C3.75 19.8978 3.90804 20.2794 4.18934 20.5607C4.47064 20.842 4.85218 21 5.25 21Z'
				stroke='#1A1A1A'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
