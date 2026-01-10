import { DiscountBanner } from '@/src/components/DiscountBanner'
import { Courses } from '@/src/modules/courses'
import { PricingPlans } from '@/src/modules/pricing-plans'

const CoursesPage = () => {
	return (
		<main>
			<Courses />
			<PricingPlans />
			<DiscountBanner />
		</main>
	)
}

export default CoursesPage
