export type ButtonVariant = 'default' | 'outlined' | 'contained'
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant
}
