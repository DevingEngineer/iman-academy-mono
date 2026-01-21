type ShoppingBagIconProps = React.SVGProps<SVGSVGElement>

export const ShoppingBagIcon = (props: ShoppingBagIconProps) => {
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
				d='M20 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20M4 20C4 19.4696 4.21071 18.9609 4.58579 18.5858C4.96086 18.2107 5.46957 18 6 18H20V6C20 4.114 20 3.172 19.414 2.586C18.828 2 17.886 2 16 2H10C7.172 2 5.757 2 4.879 2.879C4 3.757 4 5.172 4 8V20Z'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='M19.5 18C19.5 18 18.5 18.763 18.5 20C18.5 21.237 19.5 22 19.5 22M9 10C9 10 11.21 7 12 7C12.79 7 15 10 15 10M12 7.5V13'
				stroke='currentColor'
				strokeWidth='1.5'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
