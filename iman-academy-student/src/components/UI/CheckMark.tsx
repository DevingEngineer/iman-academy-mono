import { cn } from '@/src/lib/cn'
import { CheckmarkProps } from '@/src/types/checkboxType'
import { CheckIcon } from '../icons/CheckIcon'

export const Checkmark = ({ active, className }: CheckmarkProps) => {
	return (
		<div className={cn(className, active && 'bg-accent_brand')}>
			{active && <CheckIcon />}
		</div>
	)
}
