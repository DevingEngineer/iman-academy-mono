import { InputHTMLAttributes } from 'react'

export type InputProps = {
	label?: string
	error?: string
	hint?: string
	children?: React.ReactNode
	required: boolean
} & InputHTMLAttributes<HTMLInputElement>
