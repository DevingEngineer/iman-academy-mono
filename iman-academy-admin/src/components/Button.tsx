import { buttonBaseStyles, buttonSizes, buttonVariants } from '../consts/button'
import { cn } from '../lib/cn'
import { ButtonProps } from '../types/button'

export const Button = ({ className, children, ...props }: ButtonProps) => {
	const variant = buttonVariants[props.variant || 'contained']
	const size = buttonSizes[props.size || 'md']

	return (
		<button
			className={cn(buttonBaseStyles, variant, size, className)}
			{...props}
		>
			{children}
		</button>
	)
}
