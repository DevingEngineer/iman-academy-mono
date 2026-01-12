import { LittlleStar } from '@/src/components/icons/LittlleStar'

type ConsultButtonProps = {
	title: string
}

export const ConsultButton = ({ title }: ConsultButtonProps) => {
	return (
		<button className='flex items-center py-[10px] px-[21px] gap-[5px] bg-white outline-none border-none hover:bg-focus_ring rounded-[40px] transform transition-all duration-200'>
			<span className='text-primary_brand'>
				<LittlleStar />
			</span>
			{title}
		</button>
	)
}
