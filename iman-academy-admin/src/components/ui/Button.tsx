import {
	buttonBaseStyles,
	buttonSizes,
	buttonVariants,
} from '@/src/consts/button'
import { cn } from '@/src/lib/cn'
import { ButtonProps } from '@/src/types/button'

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
