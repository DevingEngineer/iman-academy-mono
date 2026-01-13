import { DiscountBanner } from '@/src/components/DiscountBanner'
import { Consultation } from '@/src/modules/consultation'
import { Courses } from '@/src/modules/courses'
import { PricingPlans } from '@/src/modules/pricing-plans'

const CoursesPage = () => {
	return (
		<>
			<Courses />
			<PricingPlans />
			<DiscountBanner />
			<Consultation />
		</>
	)
}

export default CoursesPage
