import { ConsultationSectionContent } from '../consultation-section-content/ConsultationSectionContent'
import { ConsultationSectionForm } from '../consultation-section-form/ConsultationSectionForm'

export const ConsultationSection = () => {
	return (
		<section className='container py-[44px] grid grid-cols-2 gap-6 w850:grid-cols-1 w750:py-5'>
			<ConsultationSectionContent />
			<ConsultationSectionForm />
		</section>
	)
}
