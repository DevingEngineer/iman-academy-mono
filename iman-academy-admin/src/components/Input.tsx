import { cn } from '../lib/cn'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label?: string
	error?: boolean
	supportText?: string
}

export const Input = (props: InputProps) => {
	const { label, error, supportText, className, ...restProps } = props

	return (
		<div className='flex flex-col'>
			<label htmlFor={props.id} className='font-medium leading-[138%]'>
				{label}
			</label>

			<input
				id={props.id}
				{...restProps}
				className={cn(
					'py-[10px] px-[15px] rounded-lg my-[2px] border border-color_border_light bg-transparent',
					error && 'border-color_system_red focus:border-color_system_red',
					!error && 'focus:border-color_system_blue',
					className
				)}
			/>

			{supportText && (
				<span
					className={cn(
						'text-sm leading-[138%]',
						error && 'text-color_system_red'
					)}
				>
					{supportText}
				</span>
			)}
		</div>
	)
}
