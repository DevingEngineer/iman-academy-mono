import { ConsultationSectionContent } from '../consultation-section-content/ConsultationSectionContent'
import { ConsultationSectionForm } from '../consultation-section-form/ConsultationSectionForm'

export const ConsultationSection = () => {
	return (
		<section className='pt-[120px] pb-[44px] grid grid-cols-2 gap-6 w850:grid-cols-1'>
			<ConsultationSectionContent />
			<ConsultationSectionForm />
		</section>
	)
}
