import { CheckboxProps } from '@/src/types/checkboxType'
import { Checkmark } from './CheckMark'

export const Checkbox = ({
	name,
	children,
	checked = false,
	onChange,
}: CheckboxProps) => (
	<label className='cursor-pointer flex items-center gap-2 w420:gap-3'>
		<input
			id={name}
			name={name}
			type='checkbox'
			checked={checked}
			onChange={onChange}
			className='hidden'
		/>
		<Checkmark
			active={checked}
			className='w-[20px] h-[20px] rounded-[5px] border flex justify-center items-center'
		/>
		<span className='body2 !font-normal'>{children}</span>
	</label>
)
