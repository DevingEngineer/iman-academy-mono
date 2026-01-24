import { cn } from '@/src/lib/cn'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string
	error?: boolean
}

export const Textarea = (props: TextareaProps) => {
	const { label, error, className, ...restProps } = props

	return (
		<div className='flex flex-col'>
			<label htmlFor={props.id} className='font-medium leading-[138%]'>
				{label}
			</label>

			<textarea
				id={props.id}
				{...restProps}
				className={cn(
					'py-[10px] px-[15px] rounded-lg my-[2px] border border-color_border_light outline-none bg-transparent',
					error && 'border-color_system_red focus:border-color_system_red',
					!error && 'focus:border-color_system_blue',
					className
				)}
			/>
		</div>
	)
}
