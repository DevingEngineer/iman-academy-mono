import { DiscountBanner } from '@/src/components/DiscountBanner'
import { Consultation } from '@/src/modules/consultation'
import { CourseDetails } from '@/src/modules/course-details'
import { PricingPlans } from '@/src/modules/pricing-plans'
import { Programs } from '@/src/modules/programs'
import { WhoWillTeach } from '@/src/modules/who-will-teach'

const CourseDetailsPage = () => {
	return (
		<>
			<CourseDetails />
			<WhoWillTeach />
			<Programs />
			<PricingPlans />
			<DiscountBanner />
			<Consultation />
		</>
	)
}

export default CourseDetailsPage
