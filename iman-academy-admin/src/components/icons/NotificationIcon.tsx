type NotificationIconProps = React.SVGProps<SVGSVGElement>

export const NotificationIcon = (props: NotificationIconProps) => {
	return (
		<svg
			{...props}
			width='21'
			height='21'
			viewBox='0 0 21 21'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M6.08471 7.82576H13.9083M6.08471 11.3032H13.9083M6.08471 14.7807H10.4311M19.124 10.4338C19.124 15.2353 15.2322 19.1275 10.4311 19.1275H1.73828V10.4338C1.73828 5.63236 5.63007 1.74023 10.4311 1.74023C15.2322 1.74023 19.124 5.63236 19.124 10.4338Z'
				stroke='currentColor'
				strokeWidth='1.66667'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
