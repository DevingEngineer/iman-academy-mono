import { ConsultationContent } from '../consultation-content/ConsultationContent'
import { ConsultationForm } from '../consultation-form/ConsultationForm'

export const Consultation = () => {
	return (
		<section className='container pt-[44px] pb-[44px] grid grid-cols-2 gap-6 w850:grid-cols-1 w750:py-5'>
			<ConsultationContent />
			<ConsultationForm />
		</section>
	)
}
