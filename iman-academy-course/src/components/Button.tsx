import clsx from 'clsx'
import { buttonBaseStyles, buttonVariantStyles } from '../consts/button'
import { ButtonProps } from '../types/button'

export const Button = (props: ButtonProps) => {
	const { variant = 'default', className, children, ...restProps } = props

	return (
		<button
			className={clsx(
				buttonBaseStyles,
				buttonVariantStyles[variant],
				className
			)}
			{...restProps}
		>
			{children}
		</button>
	)
}
