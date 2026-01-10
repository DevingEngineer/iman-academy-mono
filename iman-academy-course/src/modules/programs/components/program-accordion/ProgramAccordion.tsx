import { CloseIcon } from '@/src/components/icons/CloseIcon'
import { cn } from '@/src/lib/cn'
import { Dispatch, SetStateAction } from 'react'
import { ProgramAccordionSummary } from '../program-accordion-summary/ProgramAccordionSummary'

type ProgramAccordionProps = {
	setSlideOpen: Dispatch<SetStateAction<number>>
	slideOpen: number
	value: number
}

export const ProgramAccordion = ({
	setSlideOpen,
	slideOpen,
	value,
}: ProgramAccordionProps) => {
	return (
		<div className='w-full p-6 px-[30px] py-[30px] bg-white rounded-[20px] border border-border_devider'>
			<button
				onClick={() => setSlideOpen(value)}
				className='w-full flex justify-between items-center cursor-pointer list-none w450:flex-col-reverse w450:items-start w450:gap-5'
			>
				<div className='flex items-center gap-[14px]'>
					<span className='px-4 py-[10px] bg-accent_brand rounded-3xl body2 !font-normal'>
						1 Урок
					</span>
					<h4 className='h4'>Вера в Аллаха</h4>
				</div>
				<span
					className={cn(
						'w-[26px] h-[26px] flex justify-center items-center rounded-full bg-[#BDBDBD] ml-auto',
						slideOpen ? 'transform rotate-45' : 'transform rotate-0'
					)}
				>
					<CloseIcon />
				</span>
			</button>
			{slideOpen === value && <ProgramAccordionSummary />}
		</div>
	)
}
