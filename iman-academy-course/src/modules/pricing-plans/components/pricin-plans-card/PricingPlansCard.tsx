import { Button } from '@/src/components/UI/Button'
import { PricingPlansType } from '../../types'

type PricingPlansCardProps = {
	plan: PricingPlansType
}

export const PricingPlansCard = ({ plan }: PricingPlansCardProps) => {
	return (
		<div className='relative flex flex-col py-[23px] px-[30px] border border-border_devider rounded-[20px] bg-white even:bg-surface_card'>
			{plan.popular && (
				<div className='absolute body3 !font-normal whitespace-nowrap top-[-15px] left-1/2 -translate-x-1/2 bg-hover_focus py-[5px] px-[67px] rounded-2xl'>
					<span>самый популярный</span>
				</div>
			)}
			<div>
				<h3 className='h3'>{plan.title}</h3>
				<p className='body3 !font-normal text-secondary_text mt-1'>
					{plan.description}
				</p>
				<div className='mt-6'>
					<p className='body1'>Включает:</p>
					<ul className='mt-1 flex flex-col gap-1'>
						{plan.includedItems.map((item, index) => (
							<li className='body1 !font-normal' key={index}>
								{item.label}
							</li>
						))}
					</ul>
					<ul className='mt-6 flex flex-col gap-1'>
						{plan.additionalItems.map((item, index) => (
							<li className='body1 !font-normal' key={index}>
								• {item.label}
							</li>
						))}
					</ul>
					<p className='mt-6 body3 text-secondary_text'>
						{plan.additionalDescription}
					</p>
				</div>
			</div>
			<div className='flex flex-col items-center justify-center mt-auto pt-6'>
				<h3 className='h3 text-primary_brand'>{plan.price}</h3>
				<Button variant='contained' className='px-5 mt-3'>
					Купить курс
				</Button>
			</div>
		</div>
	)
}
