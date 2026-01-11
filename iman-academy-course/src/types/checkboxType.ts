export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
	children?: React.ReactNode
	name: string
	onChange: React.ChangeEventHandler<HTMLInputElement>
}

export type CheckmarkProps = {
	active: boolean
	className: string
}
