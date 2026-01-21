export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	size?: ButtonSizes
	variant?: ButtonVariants
}
export type ButtonVariants = 'contained' | 'outlined'
export type ButtonSizes = 'lg' | 'md' | 'sm'
