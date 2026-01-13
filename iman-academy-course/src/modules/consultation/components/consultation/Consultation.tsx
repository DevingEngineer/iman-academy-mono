import { ConsultationContent } from '../consultation-content/ConsultationContent'
import { ConsultationForm } from '../consultation-form/ConsultationForm'

export const Consultation = () => {
	return (
		<section className='pt-[120px] pb-[44px] grid grid-cols-2 gap-6 w850:grid-cols-1'>
			<ConsultationContent />
			<ConsultationForm />
		</section>
	)
}
