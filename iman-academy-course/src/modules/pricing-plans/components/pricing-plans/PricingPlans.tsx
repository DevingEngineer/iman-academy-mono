import { PRICING_PLANS_DATA } from '../../consts/pricinPlansData'
import { PricingPlansCard } from '../pricin-plans-card/PricingPlansCard'

export const PricingPlans = () => {
	return (
		<section className='container pt-12 pb-[68px]'>
			<h2 className='h1 text-center'>Форматы и стоимость обучения</h2>
			<div className='mt-6 pt-3 grid grid-cols-3 gap-[29px] w1150:grid-cols-2 w750:grid-cols-1'>
				{PRICING_PLANS_DATA.map((plan, index) => (
					<PricingPlansCard key={index} plan={plan} />
				))}
			</div>
		</section>
	)
}
