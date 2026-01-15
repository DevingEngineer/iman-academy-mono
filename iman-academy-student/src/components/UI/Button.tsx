import { buttonBaseStyles, buttonVariantStyles } from '../../consts/button'
import { cn } from '../../lib/cn'
import { ButtonProps } from '../../types/button'

export const Button = (props: ButtonProps) => {
	const { variant = 'default', className, children, ...restProps } = props

	return (
		<button
			className={cn(
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
