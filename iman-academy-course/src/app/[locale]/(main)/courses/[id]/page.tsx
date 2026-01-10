import { DiscountBanner } from '@/src/components/DiscountBanner'
import { ConsultationSection } from '@/src/modules/consultation-section'
import { CourseDetails } from '@/src/modules/course-details'
import { PricingPlans } from '@/src/modules/pricing-plans'
import { Programs } from '@/src/modules/programs'
import { WhoWillTeach } from '@/src/modules/who-will-teach'

const CourseDetailsPage = () => {
	return (
		<main>
			<CourseDetails />
			<WhoWillTeach />
			<Programs />
			<PricingPlans />
			<DiscountBanner />
			<ConsultationSection />
		</main>
	)
}

export default CourseDetailsPage
