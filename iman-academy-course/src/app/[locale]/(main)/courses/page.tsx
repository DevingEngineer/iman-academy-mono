import { DiscountBanner } from '@/src/components/DiscountBanner'
import { ConsultationSection } from '@/src/modules/consultation-section'
import { Courses } from '@/src/modules/courses'
import { PricingPlans } from '@/src/modules/pricing-plans'

const CoursesPage = () => {
	return (
		<>
			<Courses />
			<PricingPlans />
			<DiscountBanner />
			<ConsultationSection />
		</>
	)
}

export default CoursesPage
