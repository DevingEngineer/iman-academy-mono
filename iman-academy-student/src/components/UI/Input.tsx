import { cn } from '@/src/lib/cn'
import { InputProps } from '@/src/types/inputType'
import { forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{ label, error, hint, className, id, children, required, ...props },
		ref
	) => {
		const inputId = id ?? props.name

		return (
			<label className='flex flex-col gap-1x'>
				{label && (
					<p className='body2 !font-normal text-secondary_text'>
						{label} {required && '*'}
					</p>
				)}

				<div className='relative'>
					<input
						ref={ref}
						id={inputId}
						{...props}
						className={cn(
							'w-full py-[6px] pl-2 pr-10 rounded-[5px] border outline-none transition',
							error ? 'border-red-500' : 'border-border_devider',
							className
						)}
					/>
					{children && children}
				</div>
				{error && <p className='text-sm text-red-600'>{error}</p>}
				{!error && hint && <p className='text-xs text-gray-500'>{hint}</p>}
			</label>
		)
	}
)

Input.displayName = 'Input'
